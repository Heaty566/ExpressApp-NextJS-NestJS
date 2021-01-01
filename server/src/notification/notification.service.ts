import { Injectable } from '@nestjs/common';
import { addNewNotificationDto } from './notification.dto';

import { ObjectID } from 'typeorm';
import { Notification } from './notification.entity';
import { UserRepository } from '../user/user.repository';
import { NotificationRepository } from './notification.repository';
import * as _ from 'lodash';

@Injectable()
export class NotificationService {
        constructor(
                private readonly userRepository: UserRepository,
                private readonly notificationRepository: NotificationRepository,
        ) {}

        async getNotificationByIds(input: ObjectID[]) {
                //get notification
                const notifications = await this.notificationRepository.findManyByIds(input);

                //get sender user
                const users = await this.userRepository.getUsersByIds(notifications.map(item => item.senderId));

                return notifications.map(async item => {
                        return {
                                ...item,
                                senderId: users[String(item.senderId)],
                        };
                });
        }

        async addNewNotification(input: addNewNotificationDto): Promise<void> {
                const { action, senderId, url, receiverId } = input;
                const notification = new Notification();
                notification.action = action;
                notification.senderId = senderId;
                notification.url = url;
                notification.receiverId = receiverId;

                const newNotification = await notification.save();
                const receiverUser = await this.userRepository.findOneById(receiverId);
                receiverUser.notificationIds.push(newNotification._id);

                await receiverUser.save();
        }
}
