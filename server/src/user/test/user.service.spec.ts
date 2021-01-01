import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user.repository';
import { UserService } from '../user.service';
import { conInit } from '../../../test/test-utils/getInit';
import { getInitMiddleware } from '../../../test/test-utils/initMiddleware';
import { UserResolver } from '../user.resolver';
import { User } from '../user.entity';
import { getUserInstance } from '../../../test/test-utils/userMock';
import { ObjectId } from 'mongodb';
import { getStringAndNumber } from '../../../test/test-utils/data.helper';
import { NotificationService } from '../../notification/notification.service';
import { NotificationRepository } from '../../notification/notification.repository';

describe('User Service', () => {
        let app: INestApplication;
        let service: UserService;
        beforeAll(async () => {
                const module: TestingModule = await Test.createTestingModule({
                        imports: [...conInit(), TypeOrmModule.forFeature([UserRepository, NotificationRepository])],
                        providers: [UserService, UserResolver, NotificationService],
                }).compile();

                app = module.createNestApplication();
                app.use(getInitMiddleware());
                await app.init();

                service = module.get<UserService>(UserService);
        });

        it('should be defined', () => {
                expect(app).toBeDefined();
                expect(service).toBeDefined();
        });

        describe('getUserById', () => {
                let user: User;

                beforeAll(async () => {
                        user = getUserInstance();
                        await user.save();
                });

                it('should return user', async () => {
                        const getUser = await service.getUserById(user._id);
                        expect(getUser).toBeDefined();
                });

                it('should return undefined user (id does not exist)', async () => {
                        const getUser = await service.getUserById(getStringAndNumber(12));
                        expect(getUser).toBeUndefined();
                });
                it('should return undefined user (invalid id)', async () => {
                        try {
                                await service.getUserById(getStringAndNumber(8));
                        } catch (err) {
                                expect(err).toBeDefined();
                        }
                });
        });
});
