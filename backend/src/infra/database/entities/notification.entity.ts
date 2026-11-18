import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from 'typeorm';
import type { NotificationType } from '../../../domain/entities/notification.js';
import { InstallmentOrmEntity } from './installment.entity.js';

@Entity('notifications')
@Index('UQ_notifications_installment_type', ['installmentId', 'type'], {
  unique: true,
})
export class NotificationOrmEntity {
  @PrimaryColumn({ type: 'varchar' })
  id!: string;

  @Column({ name: 'installment_id', type: 'varchar' })
  installmentId!: string;

  @ManyToOne(
    () => InstallmentOrmEntity,
    (installment) => installment.notifications,
    {
      nullable: false,
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({ name: 'installment_id' })
  installment!: Relation<InstallmentOrmEntity>;

  @Column({ type: 'varchar', length: 30 })
  type!: NotificationType;

  @Column({ name: 'sent_at', type: 'timestamptz' })
  sentAt!: Date;

  @Column({
    name: 'message_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  messageId!: string | null;

  @Column({ type: 'text', nullable: true })
  error!: string | null;
}