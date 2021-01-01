import { Resolver } from '@nestjs/graphql';
import { UserType } from '../user/user.type';
import { Mutation, Args, Context, Query } from '@nestjs/graphql';
import { LoginUserDto, CreateUserDto } from './auth.dto';
import { AuthService } from './auth.service';
import { JoiValidatorPipe } from '../../pipes/validator.pipe';
import { UserRepository } from '../user/user.repository';

const day = 86400000;

@Resolver(of => UserType)
export class AuthResolver {
        constructor(private readonly authService: AuthService, private readonly repository: UserRepository) {}

        @Mutation(returns => Boolean)
        async loginUser(
                @Args('input', new JoiValidatorPipe(LoginUserDto.validationSchema())) input: LoginUserDto,
                @Context('res') res,
        ) {
                const token = await this.authService.loginUser(input);
                res.cookie('x-auth-token', token, { maxAge: input.isRemember ? 30 * day : day });

                return true;
        }

        @Mutation(returns => Boolean)
        async registerUser(
                @Args('input', new JoiValidatorPipe(CreateUserDto.validationSchema())) input: CreateUserDto,
                @Context('res') res,
        ) {
                const token = await this.authService.createNewUser(input);
                res.cookie('x-auth-token', token, { maxAge: day });

                return true;
        }
}
