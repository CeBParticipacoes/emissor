import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Installment } from '../../../domain/entities/installment.js';
import type { InstallmentRepository } from '../../../application/ports/repositories.js';
import { InstallmentOrmEntity } from '../entities/installment.entity.js';
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
      .where('installment.status = :status', { status: 'PENDING' })
      .andWhere('installment.dueDate <= :limit', {
        limit: dateToDatabase(limit),
      })
      .orderBy('installment.dueDate', 'ASC')
      .getMany();

    return installments.map((installment) => this.toDomain(installment));
  }

  async save(installment: Installment): Promise<void> {
    await this.repository.save(this.toOrm(installment));
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

  private toOrm(installment: Installment): InstallmentOrmEntity {
    return Object.assign(new InstallmentOrmEntity(), {
      id: installment.id,
      contractId: installment.contractId,
      number: installment.number,
      amountCents: installment.amountCents,
      dueDate: dateToDatabase(installment.dueDate),
      status: installment.status,
      idempotencyKey: installment.idempotencyKey,
      coraInvoiceId: installment.coraInvoiceId,
      bankSlipUrl: installment.bankSlipUrl,
      digitableLine: installment.digitableLine,
      pixEmv: installment.pixEmv,
      issueAttempts: installment.issueAttempts,
      lastIssueError: installment.lastIssueError,
      issuedAt: installment.issuedAt,
      paidAt: installment.paidAt,
      cancelledAt: installment.cancelledAt,
    });
  }
}