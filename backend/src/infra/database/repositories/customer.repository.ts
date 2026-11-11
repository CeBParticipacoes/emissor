import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer } from '../../../domain/entities/customer.js';
import type { CustomerRepository } from '../../../application/ports/repositories.js';
import { CustomerOrmEntity } from '../entities/customer.entity.js';

@Injectable()
export class TypeOrmCustomerRepository implements CustomerRepository {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly repository: Repository<CustomerOrmEntity>,
  ) {}

  async findByDocument(
    documentValue: string,
  ): Promise<Customer | null> {
    const customer = await this.repository.findOne({
      where: { documentValue },
    });

    return customer ? this.toDomain(customer) : null;
  }

  async save(customer: Customer): Promise<void> {
    await this.repository.save(this.toOrm(customer));
  }

  private toDomain(entity: CustomerOrmEntity): Customer {
    return new Customer(
      entity.id,
      entity.name,
      entity.documentValue,
      entity.documentType,
      entity.email,
      entity.createdAt,
    );
  }

  private toOrm(customer: Customer): CustomerOrmEntity {
    return Object.assign(new CustomerOrmEntity(), {
      id: customer.id,
      name: customer.name,
      documentValue: customer.documentValue,
      documentType: customer.documentType,
      email: customer.email,
      createdAt: customer.createdAt,
    });
  }
}