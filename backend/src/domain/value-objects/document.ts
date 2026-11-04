import { DomainError } from '../errors/domain-error.js';

export type DocumentType = 'CPF' | 'CNPJ';

const CPF_REGEX = /^\d{11}$/;
const CNPJ_REGEX = /^[A-Z0-9]{12}\d{2}$/;

const CPF_WEIGHTS = {
  first: [10, 9, 8, 7, 6, 5, 4, 3, 2],
  second: [11, 10, 9, 8, 7, 6, 5, 4, 3, 2],
};

const CNPJ_WEIGHTS = {
  first: [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  second: [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
};

function calculateCheckDigit(characters: string, weights: number[]): number {
  const sum = weights.reduce(
    (total, weight, index) =>
      total + (characters.charCodeAt(index) - 48) * weight,
    0,
  );

  const remainder = sum % 11;

  return remainder < 2 ? 0 : 11 - remainder;
}

function hasRepeatedCharacters(characters: string): boolean {
  return /^(.)(\1)+$/.test(characters);
}

function hasValidCheckDigits(
  characters: string,
  weights: { first: number[]; second: number[] },
): boolean {
  if (hasRepeatedCharacters(characters)) return false;

  const base = weights.first.length;

  return (
    calculateCheckDigit(characters, weights.first) ===
      Number(characters[base]) &&
    calculateCheckDigit(characters, weights.second) ===
      Number(characters[base + 1])
  );
}

/** CPF ou CNPJ, guardado sem pontuação. */
export class Document {
  private constructor(
    readonly digits: string,
    readonly type: DocumentType,
  ) {}

  static parse(raw: string): Document {
    const normalized = raw.replace(/[^A-Z0-9]/gi, '').toUpperCase();

    if (
      CPF_REGEX.test(normalized) &&
      hasValidCheckDigits(normalized, CPF_WEIGHTS)
    ) {
      return new Document(normalized, 'CPF');
    }

    if (
      CNPJ_REGEX.test(normalized) &&
      hasValidCheckDigits(normalized, CNPJ_WEIGHTS)
    ) {
      return new Document(normalized, 'CNPJ');
    }

    throw new DomainError(`Documento inválido: ${raw}`);
  }
}
