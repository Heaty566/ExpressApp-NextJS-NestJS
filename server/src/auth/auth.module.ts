import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy, FacebookStrategy, GithubStrategy } from './auth.passport';

@Module({
        imports: [TypeOrmModule.forFeature([UserRepository])],
        providers: [AuthResolver, AuthService, GoogleStrategy, FacebookStrategy, GithubStrategy],
        controllers: [AuthController],
})
export class AuthModule {}
