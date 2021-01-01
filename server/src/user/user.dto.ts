import { InputType, Field } from '@nestjs/graphql';
import * as Joi from 'joi';
import { userValidator } from '../../utils/validators/user.validator';

@InputType()
export class BirthDayDto {
        @Field()
        year: number;

        @Field()
        month: number;

        @Field()
        day: number;
}

@InputType()
export class RequestFriendDto {
        @Field()
        userId: string;

        static validationSchema = () => {
                return Joi.object({
                        userId: userValidator('_id'),
                });
        };
}
