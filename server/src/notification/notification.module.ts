import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/user.repository';
import { NotificationService } from './notification.service';
import { NotificationRepository } from './notification.repository';

@Module({
        imports: [TypeOrmModule.forFeature([NotificationRepository, UserRepository])],
        providers: [NotificationService],
})
export class NotificationModule {}
