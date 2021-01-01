import { Repository } from 'typeorm';

import { ObjectId } from 'mongodb';

export class ExtendRepository<T> extends Repository<T> {
        async findOneByField(field: keyof T, value: any): Promise<T> {
                return await this.findOne({ [`${field}`]: value });
        }

        async findOneById(_id: ObjectId | string): Promise<T> {
                if (typeof _id === 'string') {
                        _id = new ObjectId(_id);
                }

                return await this.findOne({ where: { _id } });
        }

        async findManyByIds(ids: string[] | ObjectId[]) {
                //casting type
                if (typeof ids[0] === 'string') {
                        ids = (ids as any[]).map(item => new ObjectId(item));
                }

                return await this.find({ where: { _id: { $in: ids } } });
        }

        async isExist(field: keyof T, value: any): Promise<boolean> {
                if (field === '_id') {
                        const idExist = await this.findOneById(value);
                        return idExist ? true : false;
                }

                const isExist = await this.findOne({ [`${field}`]: value });
                return isExist ? true : false;
        }
}
