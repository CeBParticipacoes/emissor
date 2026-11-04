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

const ASCII_ZERO = '0'.charCodeAt(0);

function characterValue(character: string): number {
  return character.charCodeAt(0) - ASCII_ZERO;
}

function calculateCheckDigit(characters: string, weights: number[]): number {
  const sum = weights.reduce(
    (total, weight, index) =>
      total + characterValue(characters[index]) * weight,
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

  const checkDigitPosition = characters.length - 2;

  return (
    calculateCheckDigit(characters, weights.first) ===
      Number(characters[checkDigitPosition]) &&
    calculateCheckDigit(characters, weights.second) ===
      Number(characters[checkDigitPosition + 1])
  );
}

export class Document {
  private constructor(
    readonly value: string,
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

    throw new DomainError('Documento inválido');
  }
}