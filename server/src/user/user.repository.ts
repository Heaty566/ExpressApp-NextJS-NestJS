import { EntityRepository } from 'typeorm';
import { ExtendRepository } from '../../models/ExtendRepository';
import { User } from './user.entity';
import { ObjectID } from 'mongodb';
import * as _ from 'lodash';

interface UserByIdsInterface {
        [_id: string]: User;
}

@EntityRepository(User)
export class UserRepository extends ExtendRepository<User> {
        public async getUsersByIds(input: ObjectID[]): Promise<UserByIdsInterface> {
                // reduce duplicate id
                const filterIds = [...new Map(input.map(item => [item.toHexString(), item])).values()];
                const users = await Promise.all(filterIds.map(item => this.findOneById(item)));
                const res: UserByIdsInterface = {};
                for (let item of users) {
                        res[String(item._id)] = item;
                }

                return res;
        }
}
