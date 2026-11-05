import { DomainError } from '../errors/domain-error.js';

export type ContractStatus = 'ACTIVE' | 'CANCELLED' | 'COMPLETED';

export class Contract {
  constructor(
    readonly id: string,
    readonly customerId: string,
    readonly description: string,
    readonly totalAmountCents: number,
    readonly installmentsCount: number,
    readonly dueDay: number,
    readonly firstDueDate: Date,
    readonly finePercent: number,
    readonly interestMonthlyPercent: number,
    public status: ContractStatus,
    readonly createdBy: string,
    readonly createdAt: Date,
  ) {}

  private ensureStatusIn(allowed: ContractStatus[], action: string): void {
    if (allowed.includes(this.status)) return;

    throw new DomainError(
      `Não é possível ${action} um contrato com status ${this.status}`,
    );
  }

  cancel(_now: Date): void {
    this.ensureStatusIn(['ACTIVE'], 'cancelar');

    this.status = 'CANCELLED';
  }

  markCompleted(): void {
    this.ensureStatusIn(['ACTIVE'], 'concluir');

    this.status = 'COMPLETED';
  }
}
