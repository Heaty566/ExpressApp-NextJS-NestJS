import { Column, ObjectID, BaseEntity, Entity, ObjectIdColumn } from 'typeorm';
import { GenderEnum, RoleEnum } from './user.enum';
import * as moment from 'moment';

@Entity()
export class User extends BaseEntity {
        @ObjectIdColumn()
        _id: ObjectID;

        @Column({ default: '' })
        username: string;

        @Column({ default: '' })
        password: string;

        @Column({ default: '' })
        name: string;

        @Column({ default: new Date() })
        birthDay: Date;

        @Column({ default: GenderEnum.MALE })
        gender: GenderEnum;

        @Column({ default: RoleEnum.USER })
        role: RoleEnum;

        @Column({ default: [] })
        friendIds: ObjectID[];

        @Column({ default: '' })
        googleId: string;

        @Column({ default: '' })
        githubId: string;

        @Column({ default: '' })
        facebookId: string;

        @Column({ default: [] })
        notificationIds: ObjectID[];

        @Column({ default: [] })
        postIds: ObjectID[];

        constructor() {
                super();
                this.username = '';
                this.password = '';
                this.name = '';
                this.birthDay = moment('01/01/2000', ['DD/MM/YYYY', moment.ISO_8601]).toDate();
                this.gender = GenderEnum.MALE;
                this.role = RoleEnum.USER;
                this.friendIds = [];
                this.googleId = '';
                this.facebookId = '';
                this.githubId = '';
                this.notificationIds = [];
                this.postIds = [];
        }
}
