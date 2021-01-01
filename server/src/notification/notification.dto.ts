import { NotificationActionEnum } from './notification.enum';
import { ObjectID } from 'typeorm';

export class addNewNotificationDto {
        receiverId: ObjectID;
        senderId: ObjectID;
        action: NotificationActionEnum;
        url: string;
}
