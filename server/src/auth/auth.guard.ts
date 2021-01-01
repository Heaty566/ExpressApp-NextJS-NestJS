import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import * as i18n from 'i18n';

//---Authentication-user-decorator-------------------
@Injectable()
export class AuthGuard implements CanActivate {
        constructor(private readonly reflector: Reflector) {}

        canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
                const ctx = GqlExecutionContext.create(context).getContext();
                const token: string = ctx.req.headers['x-auth-token'];
                if (!token) throw new UnauthorizedException(i18n.__('Invalid Token'));

                //current request role
                const role = this.reflector.get<String>('roles', context.getHandler());

                const user = this.decodeToken(token);

                //have to add user role
                // if (role !== user.)
                ctx.user = user;

                return true;
        }

        decodeToken(token: string) {
                try {
                        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
                        return decode;
                } catch (_) {
                        throw new UnauthorizedException(i18n.__('Invalid Token'));
                }
        }
}
