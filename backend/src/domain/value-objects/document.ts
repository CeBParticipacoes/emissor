import { DomainError } from '../errors/domain-error.js';

export type DocumentType = 'CPF' | 'CNPJ';

/** CPF ou CNPJ, guardado só com dígitos. */
export class Document {
  private constructor(
    readonly digits: string,
    readonly type: DocumentType,
  ) {}

  static parse(raw: string): Document {
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 11) return new Document(digits, 'CPF');
    if (digits.length === 14) return new Document(digits, 'CNPJ');
    throw new DomainError(`Documento inválido: ${raw}`);
    // TODO (aprendizado): validar os dígitos verificadores do CPF e do CNPJ.
    // Pesquise "algoritmo dígito verificador CPF". Escreva o teste antes do código.
  }
}
