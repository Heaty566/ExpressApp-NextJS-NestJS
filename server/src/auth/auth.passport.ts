import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as Google, VerifyCallback as GoogleCallback } from 'passport-google-oauth20';
import { Strategy as Facebook } from 'passport-facebook';
import { Strategy as Github } from 'passport-github';

import { UserRepository } from '../user/user.repository';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Google, 'google') {
        constructor(private readonly userRepository: UserRepository, private readonly authService: AuthService) {
                super({
                        clientID: process.env.GOOGLE_CLIENT_ID,
                        clientSecret: process.env.GOOGLE_SECRET,
                        callbackURL: '/api/auth/google/callback',
                        scope: ['email', 'profile'],
                });
        }

        async validate(accessToken: string, refreshToken: string, profile: any, done: GoogleCallback): Promise<any> {
                const { id, displayName } = profile;
                const user = await this.userRepository.findOneByField('googleId', id);
                if (!user) {
                        const newUser = await this.authService.createUserWithSocial({
                                name: displayName,
                                id: id,
                                type: 'googleId',
                        });
                        done(null, newUser);
                }

                done(null, user);
        }
}

@Injectable()
export class FacebookStrategy extends PassportStrategy(Facebook, 'facebook') {
        constructor(private readonly userRepository: UserRepository, private readonly authService: AuthService) {
                super({
                        clientID: process.env.FACEBOOK_CLIENT_ID,
                        clientSecret: process.env.FACEBOOK_SECRET,
                        callbackURL: '/api/auth/facebook/callback',
                });
        }

        async validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
                const { id, displayName } = profile;
                const user = await this.userRepository.findOneByField('facebookId', id);
                if (!user) {
                        const newUser = await this.authService.createUserWithSocial({
                                name: displayName,
                                id: id,
                                type: 'facebookId',
                        });
                        done(null, newUser);
                }

                done(null, user);
        }
}

@Injectable()
export class GithubStrategy extends PassportStrategy(Github, 'github') {
        constructor(private readonly userRepository: UserRepository, private readonly authService: AuthService) {
                super({
                        clientID: process.env.GITHUB_CLIENT_ID,
                        clientSecret: process.env.GITHUB_SECRET,
                        callbackURL: '/api/auth/github/callback',
                });
        }

        async validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
                const { id, displayName } = profile;
                const user = await this.userRepository.findOneByField('githubId', id);
                if (!user) {
                        const newUser = await this.authService.createUserWithSocial({
                                name: displayName,
                                id: id,
                                type: 'githubId',
                        });
                        done(null, newUser);
                }

                done(null, user);
        }
}
