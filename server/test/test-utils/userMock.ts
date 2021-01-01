import * as faker from 'faker/locale/en';
import { User } from '../../src/user/user.entity';
import { CreateUserDto, LoginUserDto } from '../../src/auth/auth.dto';
import { getString, getStringAndNumber } from './data.helper';

export const getUserInstance = (): User => {
        const newUser = new User();
        newUser.name = getString(8);
        newUser.username = getStringAndNumber(10);
        newUser.password = getStringAndNumber(10);

        return newUser;
};

export const getCreateUserDto = (input: User): CreateUserDto => {
        return {
                username: input.username,
                password: input.password,
                name: input.name,
                gender: input.gender,
                birthDay: { day: 1, month: 1, year: 2000 },
                confirmPassword: input.password,
        };
};
export const getLoginUserDto = (input: User): LoginUserDto => {
        return {
                username: input.username,
                password: input.password,
                isRemember: true,
        };
};
