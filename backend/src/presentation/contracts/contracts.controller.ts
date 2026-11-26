import { Controller, Get, UseGuards } from '@nestjs/common';

import type { Contract } from '../../domain/entities/contract.js';
import { ListContractsUseCase } from '../../application/use-cases/list-contracts.use-case.js';

import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

function toContractResponse(contract: Contract) {
  return {
    id: contract.id,
    customerId: contract.customerId,
    description: contract.description,
    totalAmountCents: contract.totalAmountCents,
    installmentsCount: contract.installmentsCount,
    dueDay: contract.dueDay,
    firstDueDate: contract.firstDueDate,
    status: contract.status,
    createdAt: contract.createdAt,
  };
}

@Controller('contracts')
@UseGuards(JwtAuthGuard)
export class ContractsController {
  constructor(
    private readonly listContracts: ListContractsUseCase,
  ) {}

  @Get()
  async list() {
    const contracts = await this.listContracts.execute();

    return contracts.map(toContractResponse);
  }
}