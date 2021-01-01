import { InputType, Field } from '@nestjs/graphql';
import * as Joi from 'joi';
import { messages } from '../../utils/message';
import { formatError } from '../../utils/validators/joi.error';
import { userValidator } from '../../utils/validators/user.validator';
import { BirthDayDto } from '../user/user.dto';
import { GenderEnum } from '../user/user.enum';

@InputType()
export class CreateUserDto {
        @Field()
        readonly username: string;

        @Field()
        readonly password: string;

        @Field()
        readonly confirmPassword: string;

        @Field()
        readonly name: string;

        @Field()
        readonly birthDay: BirthDayDto;

        @Field()
        readonly gender: GenderEnum;

        static validationSchema = () => {
                const schema = userValidator(['username', 'password', 'name', 'birthDay', 'gender']);
                schema['confirmPassword'] = userValidator('password')
                        .valid(Joi.ref('password'))
                        .messages(
                                formatError('Confirm Password', {
                                        'any.only': `Confirm password ${messages.matchWith} password`,
                                }),
                        );

                return Joi.object(schema);
        };
}

@InputType()
export class LoginUserDto {
        @Field()
        readonly username: string;

        @Field()
        readonly password: string;

        @Field()
        isRemember: boolean;

        static validationSchema = () => {
                const schema = userValidator(['username', 'password']);
                schema[`isRemember`] = Joi.boolean()
                        .required()
                        .messages(formatError('Is Remember'));

                return Joi.object(schema);
        };
}
