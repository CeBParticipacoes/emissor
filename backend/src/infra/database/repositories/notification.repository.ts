import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Notification,
  type NotificationType,
} from '../../../domain/entities/notification.js';
import type { NotificationRepository } from '../../../application/ports/repositories.js';
import { NotificationOrmEntity } from '../entities/notification.entity.js';

@Injectable()
export class TypeOrmNotificationRepository
  implements NotificationRepository
{
  constructor(
    @InjectRepository(NotificationOrmEntity)
    private readonly repository: Repository<NotificationOrmEntity>,
  ) {}

  async wasSent(
    installmentId: string,
    type: NotificationType,
  ): Promise<boolean> {
    return this.repository.exists({
      where: { installmentId, type },
    });
  }

  async record(notification: Notification): Promise<void> {
    await this.repository.save(this.toOrm(notification));
  }

  private toOrm(notification: Notification): NotificationOrmEntity {
    return Object.assign(new NotificationOrmEntity(), {
      id: notification.id,
      installmentId: notification.installmentId,
      type: notification.type,
      sentAt: notification.sentAt,
      messageId: notification.messageId,
      error: notification.error,
    });
  }
}