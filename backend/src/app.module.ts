import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthController } from './presentation/health/health.controller.js';
import { ENV, loadEnv } from './infra/config/env.js';
import { CLOCK, SystemClock } from './application/ports/clock.js';

/**
 * Raiz da aplicação. Conforme for implementando, adicione aqui:
 *   - TypeOrmModule.forRoot(...) e os módulos de presentation (AuthModule, ContractsModule...)
 *   - providers ligando porta → implementação:
 *       { provide: BANK_GATEWAY, useClass: CoraBankGateway }
 *       { provide: EMAIL_SENDER, useClass: ResendEmailSender }
 *       { provide: CONTRACT_REPOSITORY, useClass: TypeOrmContractRepository }
 *   - DailyJobs em providers.
 */
@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [HealthController],
  providers: [
    { provide: ENV, useFactory: () => loadEnv() },
    { provide: CLOCK, useClass: SystemClock },
  ],
})
export class AppModule {}
