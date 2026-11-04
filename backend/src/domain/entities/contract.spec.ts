import { describe, expect, it } from 'vitest';
import { Contract, type ContractStatus } from './contract.js';

function buildContract(
  overrides: Partial<{ id: string; status: ContractStatus }> = {},
) {
  const { id = 'contract-1', status = 'ACTIVE' } = overrides;

  return new Contract(
    id,
    'customer-1',
    'Contrato de teste',
    120000,
    12,
    10,
    new Date('2026-11-10T00:00:00.000Z'),
    2,
    1,
    status,
    'user-1',
    new Date('2026-10-01T00:00:00.000Z'),
  );
}

describe('Contract', () => {
  it('cancela um contrato ativo', () => {
    const contract = buildContract();

    contract.cancel(new Date('2026-10-26T12:00:00.000Z'));

    expect(contract.status).toBe('CANCELLED');
  });

  it('não permite cancelar um contrato que não está ativo', () => {
    const contract = buildContract({ status: 'CANCELLED' });

    expect(() => contract.cancel(new Date())).toThrow(
      'Não é possível cancelar um contrato com status CANCELLED',
    );
  });

  it('marca um contrato ativo como concluído', () => {
    const contract = buildContract();

    contract.markCompleted();

    expect(contract.status).toBe('COMPLETED');
  });

  it('não permite concluir um contrato que não está ativo', () => {
    const contract = buildContract({ status: 'CANCELLED' });

    expect(() => contract.markCompleted()).toThrow();
  });
});
