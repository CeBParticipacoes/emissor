export const CLOCK = Symbol('Clock');

/**
 * Abstrai "que dia é hoje". Nos testes, injete um Clock fixo
 * para simular "hoje é 10 dias antes do vencimento".
 */
export interface Clock {
  now(): Date;
}

export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}
