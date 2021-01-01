import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { User } from './user/user.entity';
import { Notification } from './notification/notification.entity';
import { NotificationModule } from './notification/notification.module';

const envPath = `./config/${
        process.env.NODE_ENV === 'development'
                ? '.development.env'
                : process.env.NODE_ENV === 'production'
                ? '.env'
                : '.test.env'
}`;

const db: TypeOrmModuleOptions = {
        type: 'mongodb',
        url: process.env.DB_URL,
        useUnifiedTopology: true,
        synchronize: true,
        database: 'expressApp',
        entities: [User, Notification],
};

@Module({
        imports: [
                TypeOrmModule.forRoot(db),
                ConfigModule.forRoot({
                        envFilePath: envPath,
                }),
                GraphQLModule.forRoot({
                        autoSchemaFile: true,
                        cors: {
                                origin: [`${process.env.CLIENT_URL}`],
                                credentials: true,
                        },
                        path: '/api/graphql',
                        context: ({ req, res }) => ({
                                req,
                                res,
                        }),
                }),
                AuthModule,
                UserModule,
                NotificationModule,
        ],
})
export class AppModule {}
