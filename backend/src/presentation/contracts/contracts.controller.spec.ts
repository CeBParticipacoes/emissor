import { describe, expect, it, vi } from 'vitest';

import { Contract } from '../../domain/entities/contract.js';
import { ListContractsUseCase } from '../../application/use-cases/list-contracts.use-case.js';

import { ContractsController } from './contracts.controller.js';

describe('ContractsController', () => {
  function createController(contracts: Contract[] = []) {
    const listContracts = {
      execute: vi.fn().mockResolvedValue(contracts),
    };

    const controller = new ContractsController(
      listContracts as unknown as ListContractsUseCase,
    );

    return { controller, listContracts };
  }

  it('deve retornar os contratos com os campos esperados', async () => {
    const firstDueDate = new Date('2027-01-10T00:00:00.000Z');
    const createdAt = new Date('2026-11-25T12:00:00.000Z');

    const contract = new Contract(
      'contract-123',
      'customer-123',
      'Contrato de teste',
      120000,
      12,
      10,
      firstDueDate,
      2,
      1,
      'ACTIVE',
      'user-123',
      createdAt,
    );

    const { controller } = createController([contract]);

    await expect(controller.list()).resolves.toEqual([
      {
        id: 'contract-123',
        customerId: 'customer-123',
        description: 'Contrato de teste',
        totalAmountCents: 120000,
        installmentsCount: 12,
        dueDay: 10,
        firstDueDate,
        status: 'ACTIVE',
        createdAt,
      },
    ]);
  });

  it('deve retornar uma lista vazia quando não existirem contratos', async () => {
    const { controller } = createController();

    await expect(controller.list()).resolves.toEqual([]);
  });

  it('deve executar o ListContractsUseCase uma única vez', async () => {
    const { controller, listContracts } = createController();

    await controller.list();

    expect(listContracts.execute).toHaveBeenCalledTimes(1);
  });
});
