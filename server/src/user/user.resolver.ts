import { Resolver, Query, Context, Mutation, Args } from '@nestjs/graphql';
import { UserType } from './user.type';
import { UserService } from './user.service';
import { User } from './user.entity';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/auth.decorator';
import { RequestFriendDto } from './user.dto';
import { RoleEnum } from './user.enum';
import { addNewNotificationDto } from '../notification/notification.dto';
import { NotificationActionEnum } from '../notification/notification.enum';
import { JoiValidatorPipe } from '../../pipes/validator.pipe';
import { NotificationService } from '../notification/notification.service';
import { ObjectID } from 'mongodb';
import * as i18n from 'i18n';

@Resolver(of => UserType)
export class UserResolver {
        constructor(
                private readonly userService: UserService,
                private readonly notificationService: NotificationService,
        ) {}

        @Query(returns => UserType)
        @Roles(RoleEnum.USER)
        @UseGuards(AuthGuard)
        async getCurrentUser(@Context('user') user: User) {
                return await this.userService.getUserById(user._id);
        }

        @Mutation(returns => String)
        @Roles(RoleEnum.USER)
        @UseGuards(AuthGuard)
        async requestFriend(
                @Args('input', new JoiValidatorPipe(RequestFriendDto.validationSchema())) input: RequestFriendDto,
                @Context('user') user: User,
        ) {
                const { userId } = input;
                const getUser = await this.userService.getUserById(userId);
                if (!getUser) throw new BadRequestException("Friend's is not an user");

                const request: addNewNotificationDto = {
                        action: NotificationActionEnum.FRIENDREQUEST,
                        senderId: user._id,
                        url: '',
                        receiverId: getUser._id,
                };

                await this.notificationService.addNewNotification(request);

                return i18n.__('Request friend has been sent');
        }

        // @Mutation(returns => String)
        // @Roles(RoleEnum.USER)
        // @UseGuards(AuthGuard)
        // async addNewFriend(
        //         @Args('input', new JoiValidatorPipe(AddFriendDto.validationSchema())) input: AddFriendDto,
        //         @Context('user') user: User,
        // ) {
        //         const { userId } = input;
        //         await this.userService.addNewFriend(userId, user._id);
        //         return userId;
        // }
}
