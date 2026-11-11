import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HealthController } from './presentation/health/health.controller.js';

import { ENV, type Env } from './infra/config/env.js';
import { EnvironmentModule } from './infra/config/environment.module.js';

import { CLOCK, SystemClock } from './application/ports/clock.js';

import {
  USER_REPOSITORY,
  CUSTOMER_REPOSITORY,
  CONTRACT_REPOSITORY,
  INSTALLMENT_REPOSITORY,
  NOTIFICATION_REPOSITORY,
} from './application/ports/repositories.js';

import { ORM_ENTITIES } from './infra/database/entities/orm-entities.js';

import { TypeOrmUserRepository } from './infra/database/repositories/user.repository.js';
import { TypeOrmCustomerRepository } from './infra/database/repositories/customer.repository.js';
import { TypeOrmContractRepository } from './infra/database/repositories/contract.repository.js';
import { TypeOrmInstallmentRepository } from './infra/database/repositories/installment.repository.js';
import { TypeOrmNotificationRepository } from './infra/database/repositories/notification.repository.js';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EnvironmentModule,

    TypeOrmModule.forRootAsync({
      imports: [EnvironmentModule],
      inject: [ENV],
      useFactory: (env: Env) => ({
        type: 'postgres' as const,
        host: env.DB_HOST,
        port: env.DB_PORT,
        username: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        entities: ORM_ENTITIES,
        synchronize: false,
      }),
    }),

    TypeOrmModule.forFeature(ORM_ENTITIES),
  ],

  controllers: [HealthController],

  providers: [
    { provide: CLOCK, useClass: SystemClock },

    { provide: USER_REPOSITORY, useClass: TypeOrmUserRepository },
    { provide: CUSTOMER_REPOSITORY, useClass: TypeOrmCustomerRepository },
    { provide: CONTRACT_REPOSITORY, useClass: TypeOrmContractRepository },
    { provide: INSTALLMENT_REPOSITORY, useClass: TypeOrmInstallmentRepository },
    { provide: NOTIFICATION_REPOSITORY, useClass: TypeOrmNotificationRepository },
  ],
})
export class AppModule {}