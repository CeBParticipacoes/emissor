/** Erro de regra de negócio. A camada HTTP converte em 400/409. */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}
