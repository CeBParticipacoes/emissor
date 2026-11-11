import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Contract } from '../../../domain/entities/contract.js';
import type { ContractRepository } from '../../../application/ports/repositories.js';
import type { Installment } from '../../../domain/entities/installment.js';

import { ContractOrmEntity } from '../entities/contract.entity.js';
import { InstallmentOrmEntity } from '../entities/installment.entity.js';
import { toInstallmentOrm } from '../mappers/installment.mapper.js';
import {
  dateFromDatabase,
  dateToDatabase,
} from '../utils/date.only.js';

@Injectable()
export class TypeOrmContractRepository implements ContractRepository {
  constructor(
    @InjectRepository(ContractOrmEntity)
    private readonly repository: Repository<ContractOrmEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findById(id: string): Promise<Contract | null> {
    const contract = await this.repository.findOne({
      where: { id },
    });

    return contract ? this.toDomain(contract) : null;
  }

  async list(): Promise<Contract[]> {
    const contracts = await this.repository.find();

    return contracts.map((contract) => this.toDomain(contract));
  }

  async save(contract: Contract): Promise<void> {
    await this.repository.save(this.toOrm(contract));
  }

  async saveWithInstallments(
    contract: Contract,
    installments: Installment[],
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const contractRepository = manager.getRepository(ContractOrmEntity);
      const installmentRepository = manager.getRepository(InstallmentOrmEntity);

      await contractRepository.save(this.toOrm(contract));

      await installmentRepository.save(
        installments.map(toInstallmentOrm),
      );
    });
  }

  private toDomain(entity: ContractOrmEntity): Contract {
    return new Contract(
      entity.id,
      entity.customerId,
      entity.description,
      entity.totalAmountCents,
      entity.installmentsCount,
      entity.dueDay,
      dateFromDatabase(entity.firstDueDate),
      entity.finePercent,
      entity.interestMonthlyPercent,
      entity.status,
      entity.createdBy,
      entity.createdAt,
    );
  }

  private toOrm(contract: Contract): ContractOrmEntity {
    return Object.assign(new ContractOrmEntity(), {
      id: contract.id,
      customerId: contract.customerId,
      description: contract.description,
      totalAmountCents: contract.totalAmountCents,
      installmentsCount: contract.installmentsCount,
      dueDay: contract.dueDay,
      firstDueDate: dateToDatabase(contract.firstDueDate),
      finePercent: contract.finePercent,
      interestMonthlyPercent: contract.interestMonthlyPercent,
      status: contract.status,
      createdBy: contract.createdBy,
      createdAt: contract.createdAt,
    });
  }
}