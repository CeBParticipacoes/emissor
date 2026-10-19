import { DomainError } from '../errors/domain-error.js';

/**
 * Dia do mês em que as parcelas vencem (1 a 31).
 * Se o mês não tem esse dia (31 em fevereiro), usa o último dia do mês.
 */
export class DueDay {
  private constructor(readonly day: number) {}

  static of(day: number): DueDay {
    if (!Number.isInteger(day) || day < 1 || day > 31) {
      throw new DomainError(`Dia de vencimento inválido: ${day}`);
    }
    return new DueDay(day);
  }

  /** Data de vencimento para um ano/mês. `month` é 1..12. */
  resolve(year: number, month: number): Date {
    const lastDayOfMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    return new Date(Date.UTC(year, month - 1, Math.min(this.day, lastDayOfMonth)));
  }
}
