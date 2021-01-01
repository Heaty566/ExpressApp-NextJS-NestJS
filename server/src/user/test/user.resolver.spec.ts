import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user.repository';
import { UserService } from '../user.service';
import { conInit } from '../../../test/test-utils/getInit';
import { getInitMiddleware } from '../../../test/test-utils/initMiddleware';
import { UserResolver } from '../user.resolver';
import { User } from '../user.entity';
import { getCreateUserDto, getLoginUserDto, getUserInstance } from '../../../test/test-utils/userMock';
import { ObjectId } from 'mongodb';
import * as request from 'supertest';
import { getStringAndNumber } from '../../../test/test-utils/data.helper';
import { AuthService } from '../../auth/auth.service';
import { NotificationService } from '../../notification/notification.service';
import { NotificationRepository } from '../../notification/notification.repository';

const getCurrentUserQuery = () => {
        return {
                query: `query { getCurrentUser {username }}`,
        };
};

const requestFriendMutation = id => {
        return {
                query: `mutation { requestFriend(input: {userId: "${id}"}) }`,
        };
};

describe('User resolver', () => {
        let app: INestApplication;
        let service: UserService;
        let authService: AuthService;
        let resolver: UserResolver;
        let user: User;
        let token;
        let userRepository: UserRepository;
        beforeAll(async () => {
                const module: TestingModule = await Test.createTestingModule({
                        imports: [...conInit(), TypeOrmModule.forFeature([UserRepository, NotificationRepository])],
                        providers: [UserService, UserResolver, AuthService, NotificationService],
                }).compile();

                app = module.createNestApplication();
                app.use(getInitMiddleware());
                await app.init();

                service = module.get<UserService>(UserService);
                resolver = module.get<UserResolver>(UserResolver);
                authService = module.get<AuthService>(AuthService);
                userRepository = module.get<UserRepository>(UserRepository);
        });

        beforeAll(async () => {
                user = getUserInstance();
                token = await authService.createNewUser(getCreateUserDto(user));
        });

        it('should be defined', () => {
                expect(app).toBeDefined();
                expect(service).toBeDefined();
                expect(resolver).toBeDefined();
                expect(userRepository).toBeDefined();
                expect(authService).toBeDefined();
        });

        describe('getCurrentUser', () => {
                it('should return user', async () => {
                        const { body } = await request(app.getHttpServer())
                                .post('/api/graphql')
                                .set({ 'x-auth-token': token })
                                .send(getCurrentUserQuery());
                        expect(body.data.getCurrentUser).toBeDefined();
                });
                it('should return error with non token', async () => {
                        const { body } = await request(app.getHttpServer())
                                .post('/api/graphql')

                                .send(getCurrentUserQuery());

                        expect(body.errors).toBeDefined();
                });
                it('should return error with invalid token', async () => {
                        const { body } = await request(app.getHttpServer())
                                .post('/api/graphql')
                                .set({ 'x-auth-token': getStringAndNumber(50) })
                                .send(getCurrentUserQuery());

                        expect(body.errors).toBeDefined();
                });
        });

        describe('requestFriend', () => {
                let friendUser: User;
                beforeAll(async () => {
                        friendUser = getUserInstance();
                        await friendUser.save();
                });

                it('should return user', async () => {
                        await request(app.getHttpServer())
                                .post('/api/graphql')
                                .set({ 'x-auth-token': token })
                                .send(requestFriendMutation(friendUser._id));

                        const test = await userRepository.findOneById(friendUser._id);

                        console.log(test);
                });
        });

        afterAll(async () => {
                await userRepository.clear();
                await app.close();
        });
});
