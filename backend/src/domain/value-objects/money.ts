import { DomainError } from '../errors/domain-error.js';

/**
 * Dinheiro é SEMPRE inteiro em centavos. R$ 10,01 = 1001.
 * Nunca use `number` com decimal para dinheiro: 0.1 + 0.2 !== 0.3 em JavaScript.
 */
export class Money {
  private constructor(readonly cents: number) {}

  static fromCents(cents: number): Money {
    if (!Number.isInteger(cents) || cents < 0) {
      throw new DomainError(`Valor inválido em centavos: ${cents}`);
    }
    return new Money(cents);
  }

  /** Divide em `parts` parcelas. Os centavos que sobram vão na última. */
  split(parts: number): Money[] {
    if (!Number.isInteger(parts) || parts < 1) {
      throw new DomainError(`Número de parcelas inválido: ${parts}`);
    }
    const base = Math.floor(this.cents / parts);
    const remainder = this.cents - base * parts;
    return Array.from({ length: parts }, (_, i) =>
      Money.fromCents(i === parts - 1 ? base + remainder : base),
    );
  }

  format(): string {
    return (this.cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
