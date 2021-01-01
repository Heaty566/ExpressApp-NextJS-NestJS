import * as Joi from 'joi';
import * as moment from 'moment';
import { isValidObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';

export const JoiMongoId = Joi.extend(Joi => {
        return {
                type: 'mongoId',
                base: Joi.string(),
                messages: {
                        'mongoId.invalid': '{{#label}} should be a mongodb Object Id',
                },
                validate(value, helpers) {
                        if (!isValidObjectId(value)) {
                                return {
                                        value,
                                        errors: helpers.error('mongoId.invalid'),
                                };
                        }

                        return { value: new ObjectId(value) };
                },
        };
});

export const JoiTime = Joi.extend(Joi => {
        return {
                type: 'day',
                messages: {
                        'day.invalid': '{{#label}} should be a valid day',
                },
                validate(value: { day: number; month: number; year: number }, helpers) {
                        const { day, month, year } = value;
                        const time = moment(`${day}-${month}-${year}`, ['DD-MM-YYYY', moment.ISO_8601]);
                        if (!time.isValid())
                                return {
                                        value: time,
                                        errors: helpers.error('day.invalid'),
                                };

                        return { value: time.toDate() };
                },
        };
});
