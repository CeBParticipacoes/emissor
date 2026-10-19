import { DomainError } from '../errors/domain-error.js';

/**
 * Ciclo de vida de uma parcela:
 *   PENDING → ISSUED → PAID
 *   ISSUED  → OVERDUE → PAID
 *   PENDING → ISSUE_FAILED → PENDING (botão "tentar de novo")
 *   qualquer uma, exceto PAID → CANCELLED
 */
export type InstallmentStatus =
  | 'PENDING'
  | 'ISSUED'
  | 'OVERDUE'
  | 'PAID'
  | 'ISSUE_FAILED'
  | 'CANCELLED';

export class Installment {
  constructor(
    readonly id: string,
    readonly contractId: string,
    readonly number: number,
    readonly amountCents: number,
    readonly dueDate: Date,
    public status: InstallmentStatus,
    /** Gerado ANTES de chamar o Cora, para um retry não emitir dois boletos. */
    readonly idempotencyKey: string,
    public coraInvoiceId: string | null = null,
    public bankSlipUrl: string | null = null,
    public digitableLine: string | null = null,
    public pixEmv: string | null = null,
    public issueAttempts = 0,
    public lastIssueError: string | null = null,
    public issuedAt: Date | null = null,
    public paidAt: Date | null = null,
    public cancelledAt: Date | null = null,
  ) {}

  // TODO: implementar as transições abaixo, cada uma validando o status atual
  // e lançando DomainError se a mudança não for permitida. Um teste por método.

  markIssued(_data: { coraInvoiceId: string; bankSlipUrl: string; digitableLine: string; pixEmv: string | null }, _now: Date): void {
    throw new DomainError('TODO: Installment.markIssued');
  }

  markIssueFailed(_error: string, _maxAttempts: number): void {
    throw new DomainError('TODO: Installment.markIssueFailed');
  }

  markPaid(_paidAt: Date): void {
    throw new DomainError('TODO: Installment.markPaid');
  }

  markOverdue(_today: Date): void {
    throw new DomainError('TODO: Installment.markOverdue');
  }

  cancel(_now: Date): void {
    throw new DomainError('TODO: Installment.cancel');
  }
}
