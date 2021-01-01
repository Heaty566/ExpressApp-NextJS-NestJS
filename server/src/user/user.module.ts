import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserRepository } from '../user/user.repository';
import { NotificationService } from '../notification/notification.service';

@Module({
        imports: [TypeOrmModule.forFeature([UserRepository])],
        providers: [UserResolver, UserService, NotificationService],
        exports: [],
})
export class UserModule {}
