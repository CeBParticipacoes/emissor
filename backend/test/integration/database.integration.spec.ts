import { randomUUID } from 'node:crypto';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { AppModule } from '../../src/app.module.js';

import { User } from '../../src/domain/entities/user.js';
import { Customer } from '../../src/domain/entities/customer.js';
import { Contract } from '../../src/domain/entities/contract.js';
import { Installment } from '../../src/domain/entities/installment.js';
import { Document } from '../../src/domain/value-objects/document.js';

import {
  USER_REPOSITORY,
  CUSTOMER_REPOSITORY,
  CONTRACT_REPOSITORY,
  INSTALLMENT_REPOSITORY,
} from '../../src/application/ports/repositories.js';

import type {
  UserRepository,
  CustomerRepository,
  ContractRepository,
  InstallmentRepository,
} from '../../src/application/ports/repositories.js';

import { UserOrmEntity } from '../../src/infra/database/entities/user.entity.js';
import { CustomerOrmEntity } from '../../src/infra/database/entities/customer.entity.js';
import { ContractOrmEntity } from '../../src/infra/database/entities/contract.entity.js';
import { InstallmentOrmEntity } from '../../src/infra/database/entities/installment.entity.js';

describe('Database integration', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  let userRepository: UserRepository;
  let customerRepository: CustomerRepository;
  let contractRepository: ContractRepository;
  let installmentRepository: InstallmentRepository;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);

    userRepository = app.get(USER_REPOSITORY);
    customerRepository = app.get(CUSTOMER_REPOSITORY);
    contractRepository = app.get(CONTRACT_REPOSITORY);
    installmentRepository = app.get(INSTALLMENT_REPOSITORY);
  });

  afterEach(async () => {
    await app.close();
  });

  it('salva um contrato com suas parcelas e recupera os dados', async () => {
    const suffix = randomUUID();

    const userId = randomUUID();
    const customerId = randomUUID();
    const contractId = randomUUID();

    try {
      const now = new Date('2026-11-10T00:00:00.000Z');

      const document = Document.parse('11222333000181');

      const user = new User(
        userId,
        'Usuário de integração',
        `integration-${suffix}@example.com`,
        'test-password-hash',
        now,
      );

      const customer = new Customer(
        customerId,
        'Cliente de integração',
        document.value,
        document.type,
        `customer-${suffix}@example.com`,
        now,
      );

      const contract = new Contract(
        contractId,
        customerId,
        'Contrato de teste de integração',
        30000,
        3,
        10,
        new Date('2027-01-10T00:00:00.000Z'),
        2,
        1.5,
        'ACTIVE',
        userId,
        now,
      );

      const installments = [
        new Installment(
          randomUUID(),
          contractId,
          1,
          10000,
          new Date('2027-01-10T00:00:00.000Z'),
          'PENDING',
          `${suffix}-installment-1`,
        ),
        new Installment(
          randomUUID(),
          contractId,
          2,
          10000,
          new Date('2027-02-10T00:00:00.000Z'),
          'PENDING',
          `${suffix}-installment-2`,
        ),
        new Installment(
          randomUUID(),
          contractId,
          3,
          10000,
          new Date('2027-03-10T00:00:00.000Z'),
          'PENDING',
          `${suffix}-installment-3`,
        ),
      ];

      await userRepository.save(user);
      await customerRepository.save(customer);

      await contractRepository.saveWithInstallments(
        contract,
        installments,
      );

      const savedContract = await contractRepository.findById(contractId);

      const savedInstallments =
        await installmentRepository.findByContract(contractId);

      expect(savedContract).not.toBeNull();

      expect(savedContract).toMatchObject({
        id: contractId,
        customerId,
        totalAmountCents: 30000,
        installmentsCount: 3,
        status: 'ACTIVE',
        finePercent: 2,
        interestMonthlyPercent: 1.5,
      });

      expect(savedInstallments).toHaveLength(3);

      expect(savedInstallments.map((item) => item.number)).toEqual([
        1,
        2,
        3,
      ]);

      expect(savedInstallments.map((item) => item.amountCents)).toEqual([
        10000,
        10000,
        10000,
      ]);

      expect(savedInstallments[0].dueDate.toISOString()).toBe(
        '2027-01-10T00:00:00.000Z',
      );
    } finally {
      await dataSource
        .getRepository(InstallmentOrmEntity)
        .delete({ contractId });

      await dataSource
        .getRepository(ContractOrmEntity)
        .delete({ id: contractId });

      await dataSource
        .getRepository(CustomerOrmEntity)
        .delete({ id: customerId });

      await dataSource
        .getRepository(UserOrmEntity)
        .delete({ id: userId });
    }
  });
});