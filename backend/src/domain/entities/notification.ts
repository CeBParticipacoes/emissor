export type NotificationType = 'REMINDER' | 'OVERDUE_NOTICE';

export class Notification {
  constructor(
    readonly id: string,
    readonly installmentId: string,
    readonly type: NotificationType,
    readonly sentAt: Date,
    readonly messageId: string | null,
    readonly error: string | null,
  ) {}
}