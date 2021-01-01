import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GenderEnum, RoleEnum } from './user.enum';

@ObjectType('User')
export class UserType {
        @Field(returns => ID)
        _id: string;

        @Field()
        username: string;

        @Field()
        password: string;

        @Field()
        name: string;

        @Field()
        birthDay: Date;

        @Field()
        gender: GenderEnum;

        @Field()
        role: RoleEnum;

        @Field(returns => ID)
        friendIds: string[];

        @Field()
        googleId: string;

        @Field()
        githubId: string;

        @Field()
        facebookId: string;

        @Field(returns => ID)
        notificationIds: string[];

        @Field(returns => ID)
        postIds: string[];
}
