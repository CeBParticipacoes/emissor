import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HealthController } from './presentation/health/health.controller.js';

import { CLOCK, SystemClock } from './application/ports/clock.js';

import { ENV, type Env } from './infra/config/env.js';
import { EnvironmentModule } from './infra/config/environment.module.js';

import { DatabaseModule } from './infra/database/database.module.js';
import { ORM_ENTITIES } from './infra/database/entities/orm-entities.js';

import { AuthModule } from './presentation/auth/auth.module.js';
import { ContractsModule } from './presentation/contracts/contracts.module.js';

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

    DatabaseModule,
    AuthModule,
    ContractsModule,
  ],
  controllers: [HealthController],
  providers: [
    { provide: CLOCK, useClass: SystemClock },
  ],
})
export class AppModule {}
