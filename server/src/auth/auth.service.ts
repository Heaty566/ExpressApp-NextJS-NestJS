import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import * as i18n from 'i18n';
import { UserRepository } from '../user/user.repository';
import { LoginUserDto, CreateUserDto } from './auth.dto';
import { User } from '../user/user.entity';
import { messages } from '../../utils/message';
import * as Jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
        constructor(private readonly userRepository: UserRepository) {}

        //-----------Private--Service-------------------------------------
        private async compareHash(value: string, encrypted: string): Promise<boolean> {
                return await bcrypt.compare(value, encrypted);
        }

        private async hashing(value: string, rounds: number): Promise<string> {
                const salt = await bcrypt.genSalt(rounds);
                return await bcrypt.hash(value, salt);
        }

        public getToken(user: User, expired: number = 1) {
                return Jwt.sign(_.pick(user, ['username', '_id']), process.env.JWT_SECRET_KEY, {
                        expiresIn: expired * 86400,
                });
        }

        //-----------------------------------------------------------------

        //-----------Controller--Service--------------------------------------
        async createUserWithSocial({
                name,
                id,
                type,
        }: {
                name: string;
                id: string;
                type: 'githubId' | 'googleId' | 'facebookId';
        }): Promise<User> {
                const user = new User();
                user.name = name;
                user[type] = id;

                return await user.save();
        }
        //-----------------------------------------------------------------

        //-----------Resolver--Service--------------------------------------
        async loginUser(userInput: LoginUserDto): Promise<String> {
                //----Get--User------
                const user = await this.userRepository.findOneByField('username', userInput.username);
                if (!user) throw new BadRequestException(i18n.__(messages.loginFailed));
                //--Checking--Password---------
                const isCorrect = await this.compareHash(userInput.password, user.password);
                if (!isCorrect) throw new BadRequestException(i18n.__(messages.loginFailed));
                //--Generate--Token--------
                return this.getToken(user, userInput ? 30 : 3);
        }

        async createNewUser(userInput: CreateUserDto): Promise<String> {
                //---checking-unique-------

                if (await this.userRepository.isExist('username', userInput.username))
                        throw new BadRequestException(`${i18n.__('Username')}  ${i18n.__(messages.alreadyExist)}`);

                const newUser = new User();
                newUser.username = userInput.username;
                // newUser.birthDay = userInput.birthDay;
                newUser.gender = userInput.gender;
                newUser.name = userInput.name;
                newUser.password = await this.hashing(userInput.password, 10);

                await newUser.save();

                //--Generate--Token--------
                return this.getToken(newUser);
        }

        //-----------------------------------------------------------------
}
