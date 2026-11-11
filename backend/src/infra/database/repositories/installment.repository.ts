import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Installment } from '../../../domain/entities/installment.js';
import type { InstallmentStatus } from '../../../domain/entities/installment.js';
import type { InstallmentRepository } from '../../../application/ports/repositories.js';
import { InstallmentOrmEntity } from '../entities/installment.entity.js';
import { toInstallmentOrm } from '../mappers/installment.mapper.js';
import {
  dateFromDatabase,
  dateToDatabase,
} from '../utils/date.only.js';

@Injectable()
export class TypeOrmInstallmentRepository implements InstallmentRepository {
  constructor(
    @InjectRepository(InstallmentOrmEntity)
    private readonly repository: Repository<InstallmentOrmEntity>,
  ) {}

  async findByContract(contractId: string): Promise<Installment[]> {
    const installments = await this.repository.find({
      where: { contractId },
      order: { number: 'ASC' },
    });

    return installments.map((installment) => this.toDomain(installment));
  }

  async findByCoraInvoiceId(
    coraInvoiceId: string,
  ): Promise<Installment | null> {
    const installment = await this.repository.findOne({
      where: { coraInvoiceId },
    });

    return installment ? this.toDomain(installment) : null;
  }

  async findPendingDueUntil(limit: Date): Promise<Installment[]> {
    const installments = await this.repository
      .createQueryBuilder('installment')
      .where('installment.status = :status', {
        status: 'PENDING' satisfies InstallmentStatus,
      })
      .andWhere('installment.dueDate <= :limit', {
        limit: dateToDatabase(limit),
      })
      .orderBy('installment.dueDate', 'ASC')
      .getMany();

    return installments.map((installment) => this.toDomain(installment));
  }

  async save(installment: Installment): Promise<void> {
    await this.repository.save(toInstallmentOrm(installment));
  }

  private toDomain(entity: InstallmentOrmEntity): Installment {
    return new Installment(
      entity.id,
      entity.contractId,
      entity.number,
      entity.amountCents,
      dateFromDatabase(entity.dueDate),
      entity.status,
      entity.idempotencyKey,
      entity.coraInvoiceId,
      entity.bankSlipUrl,
      entity.digitableLine,
      entity.pixEmv,
      entity.issueAttempts,
      entity.lastIssueError,
      entity.issuedAt,
      entity.paidAt,
      entity.cancelledAt,
    );
  }
}