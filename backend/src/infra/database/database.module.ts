import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  USER_REPOSITORY,
  CUSTOMER_REPOSITORY,
  CONTRACT_REPOSITORY,
  INSTALLMENT_REPOSITORY,
  NOTIFICATION_REPOSITORY,
} from '../../application/ports/repositories.js';

import { ORM_ENTITIES } from './entities/orm-entities.js';

import { TypeOrmUserRepository } from './repositories/user.repository.js';
import { TypeOrmCustomerRepository } from './repositories/customer.repository.js';
import { TypeOrmContractRepository } from './repositories/contract.repository.js';
import { TypeOrmInstallmentRepository } from './repositories/installment.repository.js';
import { TypeOrmNotificationRepository } from './repositories/notification.repository.js';

@Module({
  imports: [TypeOrmModule.forFeature(ORM_ENTITIES)],
  providers: [
    { provide: USER_REPOSITORY, useClass: TypeOrmUserRepository },
    { provide: CUSTOMER_REPOSITORY, useClass: TypeOrmCustomerRepository },
    { provide: CONTRACT_REPOSITORY, useClass: TypeOrmContractRepository },
    { provide: INSTALLMENT_REPOSITORY, useClass: TypeOrmInstallmentRepository },
    { provide: NOTIFICATION_REPOSITORY, useClass: TypeOrmNotificationRepository },
  ],
  exports: [
    USER_REPOSITORY,
    CUSTOMER_REPOSITORY,
    CONTRACT_REPOSITORY,
    INSTALLMENT_REPOSITORY,
    NOTIFICATION_REPOSITORY,
  ],
})
export class DatabaseModule {}