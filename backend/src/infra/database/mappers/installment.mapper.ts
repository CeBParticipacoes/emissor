import type { Installment } from '../../../domain/entities/installment.js';
import { InstallmentOrmEntity } from '../entities/installment.entity.js';
import { dateToDatabase } from '../utils/date.only.js';

export function toInstallmentOrm(
  installment: Installment,
): InstallmentOrmEntity {
  return Object.assign(new InstallmentOrmEntity(), {
    id: installment.id,
    contractId: installment.contractId,
    number: installment.number,
    amountCents: installment.amountCents,
    dueDate: dateToDatabase(installment.dueDate),
    status: installment.status,
    idempotencyKey: installment.idempotencyKey,
    coraInvoiceId: installment.coraInvoiceId,
    bankSlipUrl: installment.bankSlipUrl,
    digitableLine: installment.digitableLine,
    pixEmv: installment.pixEmv,
    issueAttempts: installment.issueAttempts,
    lastIssueError: installment.lastIssueError,
    issuedAt: installment.issuedAt,
    paidAt: installment.paidAt,
    cancelledAt: installment.cancelledAt,
  });
}