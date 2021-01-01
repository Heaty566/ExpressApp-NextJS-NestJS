import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from '../notification.service';
import { conInit } from '../../../test/test-utils/getInit';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationRepository } from '../notification.repository';
import { UserRepository } from '../../user/user.repository';
import { FakeResolver } from '../../../test/test-utils/fakeResolver.resolver';
import { addNewNotificationDto } from '../notification.dto';
import { User } from '../../user/user.entity';
import { getUserInstance } from '../../../test/test-utils/userMock';
import { NotificationActionEnum } from '../notification.enum';
import { getStringAndNumber } from '../../../test/test-utils/data.helper';

describe('Notification Service', () => {
        let app: INestApplication;
        let service: NotificationService;
        let userRepository: UserRepository;
        let notificationRepository: NotificationRepository;
        let user1: User;
        let user2: User;

        beforeAll(async () => {
                const module: TestingModule = await Test.createTestingModule({
                        imports: [...conInit(), TypeOrmModule.forFeature([NotificationRepository, UserRepository])],
                        providers: [NotificationService, FakeResolver],
                }).compile();

                app = module.createNestApplication();
                await app.init();

                service = module.get<NotificationService>(NotificationService);
                userRepository = module.get<UserRepository>(UserRepository);
                notificationRepository = module.get<NotificationRepository>(NotificationRepository);
        });

        it('Should be defined', () => {
                expect(app).toBeDefined();
                expect(service).toBeDefined();
                expect(userRepository).toBeDefined();
                expect(notificationRepository).toBeDefined();
        });

        beforeAll(async () => {
                user1 = await getUserInstance().save();
                user2 = await getUserInstance().save();
        });

        describe('addNewNotification', () => {
                it('should add new notification', async () => {
                        const notification: addNewNotificationDto = {
                                receiverId: user2._id,
                                senderId: user1._id,
                                action: NotificationActionEnum.COMMENT,
                                url: getStringAndNumber(10),
                        };
                        await service.addNewNotification(notification);
                        const getUser = await userRepository.findOneById(user2._id);

                        expect(getUser.notificationIds.length).toBeGreaterThanOrEqual(1);
                });
        });

        describe('getNotificationByIds', () => {
                beforeAll(async () => {
                        const notification: addNewNotificationDto = {
                                receiverId: user2._id,
                                senderId: user1._id,
                                action: NotificationActionEnum.COMMENT,
                                url: getStringAndNumber(10),
                        };
                        await service.addNewNotification(notification);
                });

                it('should return array notification', async () => {
                        let ids = [];
                        const notifications = await notificationRepository.find();
                        ids = notifications.map(item => item._id);

                        const getNotifications = await service.getNotificationByIds(ids);
                        expect((await getNotifications[0]).senderId).not.toBe(notifications[0].senderId);
                        expect(getNotifications.length).toBeGreaterThanOrEqual(1);
                });

                it('should return array notification', async () => {
                        let ids = [];
                        const notifications = await notificationRepository.find();
                        ids = notifications.map(item => String(item._id));

                        const getNotifications = await service.getNotificationByIds(ids);
                        expect((await getNotifications[0]).senderId).not.toBe(notifications[0].senderId);
                        expect(getNotifications.length).toBeGreaterThanOrEqual(1);
                });

                it('should return empty array', async () => {
                        const getNotifications = await service.getNotificationByIds([]);
                        expect(getNotifications).toBeDefined();
                });
        });

        afterAll(async () => {
                await userRepository.clear();
                await notificationRepository.clear();
                await app.close();
        });
});
