import { DomainError } from '../errors/domain-error.js';

/**
 * Ciclo de vida de uma parcela:
 *   PENDING → ISSUED → PAID
 *   ISSUED  → OVERDUE → PAID
 *   PENDING → ISSUE_FAILED → PENDING (botão "tentar de novo")
 *   qualquer uma, exceto PAID → CANCELLED
 */
export type InstallmentStatus =
  'PENDING' | 'ISSUED' | 'OVERDUE' | 'PAID' | 'ISSUE_FAILED' | 'CANCELLED';

function toCalendarDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function isAfterDueDay(today: Date, dueDate: Date): boolean {
  return toCalendarDay(today) > toCalendarDay(dueDate);
}

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

  private ensureStatusIn(allowed: InstallmentStatus[], action: string): void {
    if (allowed.includes(this.status)) return;

    throw new DomainError(
      `Não é possível ${action} uma parcela com status ${this.status}`,
    );
  }

  markIssued(
    data: {
      coraInvoiceId: string;
      bankSlipUrl: string;
      digitableLine: string;
      pixEmv: string | null;
    },
    now: Date,
  ): void {
    this.ensureStatusIn(['PENDING'], 'emitir');

    this.coraInvoiceId = data.coraInvoiceId;
    this.bankSlipUrl = data.bankSlipUrl;
    this.digitableLine = data.digitableLine;
    this.pixEmv = data.pixEmv;
    this.issuedAt = now;
    this.status = 'ISSUED';
  }

  markIssueFailed(error: string, maxAttempts: number): void {
    this.ensureStatusIn(['PENDING'], 'registrar falha de emissão em');

    this.issueAttempts += 1;
    this.lastIssueError = error;

    if (this.issueAttempts >= maxAttempts) {
      this.status = 'ISSUE_FAILED';
    }
  }

  retryIssue(): void {
    this.ensureStatusIn(['ISSUE_FAILED'], 'tentar novamente');

    this.issueAttempts = 0;
    this.lastIssueError = null;
    this.status = 'PENDING';
  }

  markPaid(paidAt: Date): void {
    this.ensureStatusIn(['ISSUED', 'OVERDUE'], 'registrar pagamento de');

    this.paidAt = paidAt;
    this.status = 'PAID';
  }

  markOverdue(today: Date): void {
    this.ensureStatusIn(['ISSUED'], 'marcar como vencida');

    if (!isAfterDueDay(today, this.dueDate)) {
      throw new DomainError(
        'Não é possível marcar como vencida uma parcela antes do vencimento',
      );
    }

    this.status = 'OVERDUE';
  }

  cancel(now: Date): void {
    this.ensureStatusIn(
      ['PENDING', 'ISSUED', 'OVERDUE', 'ISSUE_FAILED'],
      'cancelar',
    );

    this.cancelledAt = now;
    this.status = 'CANCELLED';
  }
}
