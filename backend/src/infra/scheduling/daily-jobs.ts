import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { IssueDueInstallmentsUseCase } from '../../application/use-cases/issue-due-installments.use-case.js';
import { SendRemindersUseCase } from '../../application/use-cases/send-reminders.use-case.js';

/**
 * Rotinas diárias. O cron só CHAMA use-cases; não tem regra de negócio.
 * Horário no fuso America/Sao_Paulo (variável TZ no .env).
 * Se o servidor estiver desligado às 06:00, o dia seguinte recupera:
 * a busca usa "due_date <= hoje + N", não "due_date == hoje + N".
 */
@Injectable()
export class DailyJobs {
  private readonly log = new Logger(DailyJobs.name);

  constructor(
    private readonly issueDue: IssueDueInstallmentsUseCase,
    private readonly sendReminders: SendRemindersUseCase,
  ) {}

  @Cron('0 6 * * *', { timeZone: 'America/Sao_Paulo' })
  async run(): Promise<void> {
    this.log.log('Iniciando rotina diária');
    const result = await this.issueDue.execute();
    this.log.log(`Emissão: ${result.issued} emitidas, ${result.failed} falharam`);
    await this.sendReminders.execute();
  }
}
