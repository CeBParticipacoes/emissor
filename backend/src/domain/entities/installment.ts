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

  markIssued(
    data: {
      coraInvoiceId: string;
      bankSlipUrl: string;
      digitableLine: string;
      pixEmv: string | null;
    },
    now: Date,
  ): void {
    if (this.status !== 'PENDING') {
      throw new DomainError(
        `Não é possível emitir uma parcela com status ${this.status}`,
      );
    }

    this.coraInvoiceId = data.coraInvoiceId;
    this.bankSlipUrl = data.bankSlipUrl;
    this.digitableLine = data.digitableLine;
    this.pixEmv = data.pixEmv;
    this.issuedAt = now;
    this.status = 'ISSUED';
  }

 markIssueFailed(error: string, maxAttempts: number): void {
  if (this.status !== 'PENDING') {
    throw new DomainError(
      `Não é possível registrar falha de emissão com status ${this.status}`,
    );
  }

  this.issueAttempts += 1;
  this.lastIssueError = error;

  if (this.issueAttempts >= maxAttempts) {
    this.status = 'ISSUE_FAILED';
  }
}

markPaid(paidAt: Date): void {
  if (this.status !== 'ISSUED' && this.status !== 'OVERDUE') {
    throw new DomainError(
      `Não é possível registrar pagamento de uma parcela com status ${this.status}`,
    );
  }

  this.paidAt = paidAt;
  this.status = 'PAID';
}

markOverdue(today: Date): void {
  if (this.status !== 'ISSUED') {
    throw new DomainError(
      `Não é possível marcar como vencida uma parcela com status ${this.status}`,
    );
  }

  if (today <= this.dueDate) {
    throw new DomainError(
      'Não é possível marcar como vencida uma parcela antes do vencimento',
    );
  }

  this.status = 'OVERDUE';
}

 cancel(now: Date): void {
  if (this.status === 'PAID') {
    throw new DomainError(
      'Não é possível cancelar uma parcela já paga',
    );
  }

  if (this.status === 'CANCELLED') {
    throw new DomainError(
      'Esta parcela já está cancelada',
    );
  }

  this.cancelledAt = now;
  this.status = 'CANCELLED';
}
}