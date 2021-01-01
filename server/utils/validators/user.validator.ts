import { User } from '../../src/user/user.entity';
import { GenderEnum } from '../../src/user/user.enum';
import { formatError } from './joi.error';

import { messages } from '../message';
import { JoiMongoId, JoiTime } from './joi.extend';
import * as Joi from 'joi';

export function userValidator(key: keyof User | (keyof User)[]) {
        function getSchema(field: keyof User) {
                switch (field) {
                        case '_id':
                                return JoiMongoId.mongoId().required();

                        case 'username':
                                return Joi.string()
                                        .max(32)
                                        .min(5)
                                        .lowercase()
                                        .trim()
                                        .default('')
                                        .alphanum()
                                        .required()
                                        .messages(formatError('Username'));

                        case 'password':
                                return Joi.string()
                                        .min(8)
                                        .max(32)
                                        .default('')
                                        .trim()
                                        .alphanum()
                                        .required()
                                        .messages(formatError('Password'));

                        case 'name':
                                return Joi.string()
                                        .min(5)
                                        .max(40)
                                        .trim()
                                        .regex(/^([a-zA-Z' ])*$/)
                                        .lowercase()
                                        .required()
                                        .messages(
                                                formatError('Name', {
                                                        'string.pattern.base': `Name ${messages.letterOnly}`,
                                                }),
                                        );

                        case 'gender':
                                return Joi.string()
                                        .valid(GenderEnum.FEMALE, GenderEnum.MALE, GenderEnum.OTHER)
                                        .default(GenderEnum.MALE)
                                        .required()
                                        .label('Test')
                                        .messages(
                                                formatError('Gender', {
                                                        'string.pattern.base': `Gender ${messages.validGender}`,
                                                }),
                                        );

                        case 'birthDay':
                                return JoiTime.day()
                                        .required()
                                        .messages(formatError('Birth day'));
                }
        }

        if (typeof key === 'object') {
                const schema = {};
                for (let field of key) {
                        schema[`${field}`] = getSchema(field);
                }

                return schema;
        }

        if (typeof key === 'string') {
                return getSchema(key);
        }
}
