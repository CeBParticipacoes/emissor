import { Module } from '@nestjs/common';

import { ListContractsUseCase } from '../../application/use-cases/list-contracts.use-case.js';
import { AuthModule } from '../auth/auth.module.js';
import { DatabaseModule } from '../../infra/database/database.module.js';
import { ContractsController } from './contracts.controller.js';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [ContractsController],
  providers: [ListContractsUseCase],
})
export class ContractsModule {}