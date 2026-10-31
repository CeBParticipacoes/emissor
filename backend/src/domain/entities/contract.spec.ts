import { describe, expect, it } from 'vitest';
import { Contract } from './contract.js';

describe('Contract', () => {
  it('cancela um contrato ativo', () => {
    const contract = new Contract(
      'contract-1',
      'customer-1',
      'Contrato de teste',
      120000,
      12,
      10,
      new Date('2026-11-10T00:00:00.000Z'),
      2,
      1,
      'ACTIVE',
      'user-1',
      new Date('2026-10-01T00:00:00.000Z'),
    );

    contract.cancel(new Date('2026-10-26T12:00:00.000Z'));

    expect(contract.status).toBe('CANCELLED');
  });

  it('não permite cancelar um contrato que não está ativo', () => {
    const contract = new Contract(
      'contract-2',
      'customer-1',
      'Contrato de teste',
      120000,
      12,
      10,
      new Date('2026-11-10T00:00:00.000Z'),
      2,
      1,
      'CANCELLED',
      'user-1',
      new Date('2026-10-01T00:00:00.000Z'),
    );

    expect(() => contract.cancel(new Date())).toThrow(
      'Não é possível cancelar um contrato com status CANCELLED',
    );
  });

  it('marca um contrato ativo como concluído', () => {
    const contract = new Contract(
      'contract-3',
      'customer-1',
      'Contrato de teste',
      120000,
      12,
      10,
      new Date('2026-11-10T00:00:00.000Z'),
      2,
      1,
      'ACTIVE',
      'user-1',
      new Date('2026-10-01T00:00:00.000Z'),
    );

    contract.markCompleted();

    expect(contract.status).toBe('COMPLETED');
  });
  
});