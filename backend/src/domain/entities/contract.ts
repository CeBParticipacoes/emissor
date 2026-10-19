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

  // TODO: cancel(now) — só permitido se ACTIVE.
  // TODO: markCompleted() — quando todas as parcelas estiverem PAID.
}
