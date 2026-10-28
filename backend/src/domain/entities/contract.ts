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

cancel(_now: Date): void {
    if (this.status !== 'ACTIVE') {
      throw new DomainError(
        `Não é possível cancelar um contrato com status ${this.status}`,
      );
    }

    this.status = 'CANCELLED';
  }

  markCompleted(): void {
    if (this.status !== 'ACTIVE') {
      throw new DomainError(
        `Não é possível concluir um contrato com status ${this.status}`,
      );
    }

    this.status = 'COMPLETED';
  }
}
