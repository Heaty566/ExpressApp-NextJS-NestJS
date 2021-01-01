import { NotificationActionEnum } from './notification.enum';
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import * as moment from 'moment';

@Entity()
export class Notification extends BaseEntity {
        @ObjectIdColumn()
        _id: ObjectID;

        @Column()
        receiverId: ObjectId;

        @Column()
        senderId: ObjectId;

        @Column()
        action: NotificationActionEnum;

        @Column()
        time: Date;

        @Column()
        url: string;
        constructor() {
                super();
                this.time = moment().toDate();
        }
}
