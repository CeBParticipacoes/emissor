import { Controller, Get, Inject, UseGuards } from '@nestjs/common';

import {
  CONTRACT_REPOSITORY,
  type ContractRepository,
} from '../../application/ports/repositories.js';

import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('contracts')
@UseGuards(JwtAuthGuard)
export class ContractsController {
  constructor(
    @Inject(CONTRACT_REPOSITORY)
    private readonly contracts: ContractRepository,
  ) {}

  @Get()
  async list() {
    const contracts = await this.contracts.list();

    return contracts.map((contract) => ({
      id: contract.id,
      customerId: contract.customerId,
      description: contract.description,
      totalAmountCents: contract.totalAmountCents,
      installmentsCount: contract.installmentsCount,
      dueDay: contract.dueDay,
      firstDueDate: contract.firstDueDate,
      status: contract.status,
      createdAt: contract.createdAt,
    }));
  }
}