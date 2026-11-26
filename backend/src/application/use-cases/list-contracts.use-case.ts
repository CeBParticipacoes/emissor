import { Inject, Injectable } from '@nestjs/common';

import type { Contract } from '../../domain/entities/contract.js';

import {
  CONTRACT_REPOSITORY,
  type ContractRepository,
} from '../ports/repositories.js';

@Injectable()
export class ListContractsUseCase {
  constructor(
    @Inject(CONTRACT_REPOSITORY)
    private readonly contracts: ContractRepository,
  ) {}

  async execute(): Promise<Contract[]> {
    return this.contracts.list();
  }
}
