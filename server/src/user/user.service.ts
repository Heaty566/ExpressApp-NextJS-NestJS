import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { UserRepository } from './user.repository';

import { User } from './user.entity';
import i18n from 'i18n';
import { messages } from '../../utils/message';
import { ObjectID } from 'typeorm';
import { ObjectId } from 'mongodb';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class UserService {
        constructor(@InjectRepository(UserRepository) private readonly userRepository: UserRepository) {}

        //-----------Private--Service-------------------------------------
        //-----------------------------------------------------------------

        //-----------Resolver--Service--------------------------------------
        async getUserById(id: ObjectId | string): Promise<User> {
                if (typeof id === 'string') {
                        id = new ObjectId(id);
                }

                const user = await this.userRepository.findOneById(id);
                return user;
        }

        async isExistUser(friendId: string | ObjectID): Promise<boolean> {
                const isExist = await this.userRepository.isExist('_id', friendId);
                if (!isExist) throw new BadRequestException(`${i18n.__('Friend')} ${i18n.__(messages.notFound)}`);

                return true;
        }

        async addNewFriend(friendId: ObjectID, currentUserId: ObjectID): Promise<void> {
                const isExist = await this.userRepository.isExist('_id', friendId);
                if (!isExist) throw new BadRequestException(`${i18n.__('Friend')} ${i18n.__(messages.notFound)}`);

                const user = await this.userRepository.findOneById(currentUserId);
                user.friendIds.push(friendId);
                await user.save();
        }
        //-----------------------------------------------------------------
}
