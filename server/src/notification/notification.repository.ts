import { EntityRepository } from 'typeorm';
import { ExtendRepository } from '../../models/ExtendRepository';
import { Notification } from './notification.entity';

@EntityRepository(Notification)
export class NotificationRepository extends ExtendRepository<Notification> {}
