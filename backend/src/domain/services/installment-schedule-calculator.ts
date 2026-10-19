import { DueDay } from '../value-objects/due-day.js';
import { Money } from '../value-objects/money.js';

export interface ScheduleInput {
  totalAmountCents: number;
  installmentsCount: number;
  dueDay: number;
  /** Mês/ano da primeira parcela. O dia vem de `dueDay`. */
  firstDueDate: Date;
}

export interface ScheduledInstallment {
  number: number;
  amountCents: number;
  dueDate: Date;
}

/**
 * Gera a lista de parcelas de um contrato: valores e datas.
 * Regra pura, sem banco. Chamada pelo use-case CreateContract.
 */
export function calculateInstallmentSchedule(input: ScheduleInput): ScheduledInstallment[] {
  const amounts = Money.fromCents(input.totalAmountCents).split(input.installmentsCount);
  const dueDay = DueDay.of(input.dueDay);
  const startYear = input.firstDueDate.getUTCFullYear();
  const startMonth = input.firstDueDate.getUTCMonth(); // 0..11

  return amounts.map((amount, i) => {
    const monthIndex = startMonth + i;
    const year = startYear + Math.floor(monthIndex / 12);
    const month = (monthIndex % 12) + 1;
    return { number: i + 1, amountCents: amount.cents, dueDate: dueDay.resolve(year, month) };
  });
}
