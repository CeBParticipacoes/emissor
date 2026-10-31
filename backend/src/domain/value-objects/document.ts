import { DomainError } from '../errors/domain-error.js';

export type DocumentType = 'CPF' | 'CNPJ';

function calculateCheckDigit(digits: string, weights: number[]): number {
  const sum = weights.reduce(
    (total, weight, index) => total + Number(digits[index]) * weight,
    0,
  );

  const remainder = sum % 11;

  return remainder < 2 ? 0 : 11 - remainder;
}

function isValidCPF(digits: string): boolean {
  if (/^(\d)\1+$/.test(digits)) return false;

  const firstDigit = calculateCheckDigit(
    digits.slice(0, 9),
    [10, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  const secondDigit = calculateCheckDigit(
    digits.slice(0, 10),
    [11, 10, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  return (
    firstDigit === Number(digits[9]) &&
    secondDigit === Number(digits[10])
  );
}

function isValidCNPJ(digits: string): boolean {
  if (/^(\d)\1+$/.test(digits)) return false;

  const firstDigit = calculateCheckDigit(
    digits.slice(0, 12),
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  const secondDigit = calculateCheckDigit(
    digits.slice(0, 13),
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  return (
    firstDigit === Number(digits[12]) &&
    secondDigit === Number(digits[13])
  );
}

/** CPF ou CNPJ, guardado só com dígitos. */
export class Document {
  private constructor(
    readonly digits: string,
    readonly type: DocumentType,
  ) {}

  static parse(raw: string): Document {
    const digits = raw.replace(/\D/g, '');

    if (digits.length === 11 && isValidCPF(digits)) {
      return new Document(digits, 'CPF');
    }

    if (digits.length === 14 && isValidCNPJ(digits)) {
      return new Document(digits, 'CNPJ');
    }

    throw new DomainError(`Documento inválido: ${raw}`);
  }
}