import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../user/user.repository';
import { ExtendRepository } from '../../../models/ExtendRepository';
import { User } from '../../user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { conInit } from '../../../test/test-utils/getInit';
import { getInitMiddleware } from '../../../test/test-utils/initMiddleware';
import { FakeResolver } from '../../../test/test-utils/fakeResolver.resolver';
import { AuthService } from '../auth.service';
import { AuthResolver } from '../auth.resolver';
import { getCreateUserDto, getLoginUserDto, getUserInstance } from '../../../test/test-utils/userMock';
import * as request from 'supertest';

import { CreateUserDto, LoginUserDto } from '../auth.dto';

const registerMutation = ({
        confirmPassword,
        gender,
        name,
        password,
        username,
        birthDay: { day, month, year },
}: CreateUserDto) => {
        return {
                query: `mutation { registerUser(input: {username: "${username}", password: "${password}",  confirmPassword: "${confirmPassword}", name: "${name}", birthDay: {day: ${day}, month: ${month}, year: ${year} }, gender:"${gender}" }) }`,
        };
};

const loginMutation = ({ password, username, isRemember }: LoginUserDto) => {
        return {
                query: `mutation { loginUser(input: {username: "${username}", password: "${password}", isRemember: ${isRemember} }) }`,
        };
};

describe('Auth Resolver', () => {
        let app: INestApplication;
        let repository: ExtendRepository<User>;
        let service: AuthService;

        beforeAll(async () => {
                const module: TestingModule = await Test.createTestingModule({
                        imports: [...conInit(), TypeOrmModule.forFeature([UserRepository])],
                        providers: [AuthService, FakeResolver, AuthResolver],
                }).compile();

                app = module.createNestApplication();
                app.use(getInitMiddleware());
                await app.init();

                service = module.get<AuthService>(AuthService);
                repository = module.get<UserRepository>(UserRepository);
        });

        it('should be define', () => {
                expect(app).toBeDefined();
                expect(service).toBeDefined();
                expect(repository).toBeDefined();
        });

        describe('registerUserr', () => {
                let userExample: User;
                beforeEach(() => {
                        userExample = getUserInstance();
                });

                it('should return token ', async () => {
                        const { header } = await request(app.getHttpServer())
                                .post('/api/graphql')
                                .send(registerMutation(getCreateUserDto(userExample)));

                        expect(header['set-cookie']).toBeDefined();
                });

                it('should return an error with wrong password ', async () => {
                        await request(app.getHttpServer())
                                .post('/api/graphql')
                                .send(registerMutation(getCreateUserDto(userExample)));

                        const { header } = await request(app.getHttpServer())
                                .post('/api/graphql')
                                .send(registerMutation(getCreateUserDto(userExample)));
                        expect(header['set-cookie']).toBeUndefined();
                });
        });
        describe('loginUser', () => {
                let userExample: User;
                beforeEach(async () => {
                        userExample = getUserInstance();
                        await request(app.getHttpServer())
                                .post('/api/graphql')
                                .send(registerMutation(getCreateUserDto(userExample)));
                });

                it('should return res with x-auth-token ', async () => {
                        const { header } = await request(app.getHttpServer())
                                .post('/api/graphql')
                                .send(loginMutation(getLoginUserDto(userExample)));

                        expect(header['set-cookie']).toBeDefined();
                });
                it('should return res with x-auth-token ', async () => {
                        const input = getLoginUserDto(userExample);
                        input.isRemember = false;
                        const { header } = await request(app.getHttpServer())
                                .post('/api/graphql')
                                .send(loginMutation(input));

                        expect(header['set-cookie']).toBeDefined();
                });

                it("should return an error with invalid input (username doesn't exit) ", async () => {
                        userExample.username = '1321dsads32';
                        const { header } = await request(app.getHttpServer())
                                .post('/api/graphql')
                                .send(loginMutation(getLoginUserDto(userExample)));

                        expect(header['set-cookie']).toBeUndefined();
                });

                it('should return an error with invalid input (wrong input) ', async () => {
                        userExample.username = '132';
                        const { header } = await request(app.getHttpServer())
                                .post('/api/graphql')
                                .send(loginMutation(getLoginUserDto(userExample)));

                        expect(header['set-cookie']).toBeUndefined();
                });
        });

        afterAll(async () => {
                await repository.clear();
                await app.close();
        });
});
