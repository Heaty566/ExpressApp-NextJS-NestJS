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
import { getCreateUserDto, getLoginUserDto, getUserInstance } from '../../../test/test-utils/userMock';
import * as request from 'supertest';
import * as faker from 'faker';

describe('Auth Service', () => {
        let app: INestApplication;
        let repository: ExtendRepository<User>;
        let service: AuthService;

        beforeAll(async () => {
                const module: TestingModule = await Test.createTestingModule({
                        imports: [...conInit(), TypeOrmModule.forFeature([UserRepository])],
                        providers: [AuthService, FakeResolver],
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

        describe('createUserWithSocial', () => {
                it('login wit facebook', async () => {
                        const user = await service.createUserWithSocial({
                                id: faker.random.uuid(),
                                name: faker.name.firstName(),
                                type: 'facebookId',
                        });
                        expect(user).toBeDefined();
                        expect(user.facebookId).toBeDefined();
                });
                it('login wit google', async () => {
                        const user = await service.createUserWithSocial({
                                id: faker.random.uuid(),
                                name: faker.name.firstName(),
                                type: 'googleId',
                        });
                        expect(user).toBeDefined();
                        expect(user.googleId).toBeDefined();
                });
                it('login wit github', async () => {
                        const user = await service.createUserWithSocial({
                                id: faker.random.uuid(),
                                name: faker.name.firstName(),
                                type: 'githubId',
                        });

                        expect(user).toBeDefined();
                        expect(user.githubId).toBeDefined();
                });
        });

        describe('createNewUser', () => {
                let userExample;
                beforeEach(() => {
                        userExample = getUserInstance();
                });

                it('should return token ', async () => {
                        const token = await service.createNewUser(getCreateUserDto(userExample));

                        expect(token).toBeDefined();
                        expect(typeof token).toBe('string');
                });

                it('should return an error with exist user ', async () => {
                        try {
                                await service.createNewUser(getCreateUserDto(userExample));
                                await service.createNewUser(getCreateUserDto(userExample));
                        } catch (err) {
                                expect(err).toBeDefined();
                        }
                });
        });
        describe('loginUser', () => {
                let userExample;
                beforeEach(async () => {
                        userExample = getUserInstance();
                        await service.createNewUser(getCreateUserDto(userExample));
                });

                it('should return token ', async () => {
                        const token = await service.loginUser(getLoginUserDto(userExample));

                        expect(token).toBeDefined();
                        expect(typeof token).toBe('string');
                });

                it('should return an error with wrong username ', async () => {
                        const wrongInput = getLoginUserDto(userExample);
                        wrongInput.username = 'unkonwuser';

                        try {
                                await service.loginUser(getLoginUserDto(userExample));
                        } catch (err) {
                                expect(err).toBeDefined();
                        }
                });

                it('should return an error with wrong password ', async () => {
                        const wrongInput = getLoginUserDto(userExample);
                        wrongInput.password = '13213213';

                        try {
                                await service.loginUser(getLoginUserDto(userExample));
                        } catch (err) {
                                expect(err).toBeDefined();
                        }
                });
        });

        afterAll(async () => {
                await repository.clear();
                await app.close();
        });
});
