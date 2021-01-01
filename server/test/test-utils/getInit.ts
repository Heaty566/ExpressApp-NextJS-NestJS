import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../src/user/user.entity';
import { Notification } from '../../src/notification/notification.entity';

//fake time
jest.useFakeTimers();

export function conInit() {
        process.env.JWT_SECRET_KEY = 'my secret';

        return [
                TypeOrmModule.forRoot({
                        type: 'mongodb',
                        url: process.env.DB_URL,
                        useUnifiedTopology: true,
                        synchronize: true,
                        database: 'expressTester',
                        entities: [User, Notification],
                }),

                GraphQLModule.forRoot({
                        autoSchemaFile: true,
                        path: '/api/graphql',
                        context: ({ req, res }) => ({
                                req,
                                res,
                        }),
                }),
        ];
}
