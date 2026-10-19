import type { DocumentType } from '../value-objects/document.js';

export class Customer {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly documentDigits: string,
    readonly documentType: DocumentType,
    readonly email: string,
    readonly createdAt: Date,
  ) {}
}
