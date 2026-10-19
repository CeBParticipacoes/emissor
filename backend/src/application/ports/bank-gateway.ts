export const BANK_GATEWAY = Symbol('BankGateway');

export interface IssueInvoiceInput {
  /** Nosso id da parcela. O Cora devolve no campo `code`. */
  code: string;
  idempotencyKey: string;
  customer: { name: string; email: string; documentDigits: string; documentType: 'CPF' | 'CNPJ' };
  description: string;
  amountCents: number;
  dueDate: Date;
  finePercent: number;
  interestMonthlyPercent: number;
}

export interface IssuedInvoice {
  coraInvoiceId: string;
  bankSlipUrl: string;
  digitableLine: string;
  pixEmv: string | null;
}

export type InvoiceStatus = 'OPEN' | 'PAID' | 'LATE' | 'CANCELLED';

/**
 * Tudo que o sistema precisa de um banco. Hoje só existe o Cora (infra/cora),
 * mas o use-case não sabe disso.
 */
export interface BankGateway {
  issueInvoice(input: IssueInvoiceInput): Promise<IssuedInvoice>;
  getInvoiceStatus(coraInvoiceId: string): Promise<{ status: InvoiceStatus; paidAt: Date | null }>;
  cancelInvoice(coraInvoiceId: string): Promise<void>;
}
