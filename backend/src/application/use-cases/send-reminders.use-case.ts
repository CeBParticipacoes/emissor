import { Inject, Injectable } from '@nestjs/common';
import { EMAIL_SENDER, type EmailSender } from '../ports/email-sender.js';
import { CLOCK, type Clock } from '../ports/clock.js';
import { INSTALLMENT_REPOSITORY, type InstallmentRepository } from '../ports/repositories.js';

/**
 * Roda todo dia. Lembrete 3 dias antes do vencimento; aviso de atraso 1 dia depois.
 * A tabela `notifications` evita mandar o mesmo e-mail duas vezes.
 */
@Injectable()
export class SendRemindersUseCase {
  constructor(
    @Inject(INSTALLMENT_REPOSITORY) private readonly installments: InstallmentRepository,
    @Inject(EMAIL_SENDER) private readonly email: EmailSender,
    @Inject(CLOCK) private readonly clock: Clock,
  ) {}

  async execute(): Promise<void> {
    // TODO: você vai precisar de um NotificationRepository (crie a porta em ports/repositories.ts)
    // com `wasSent(installmentId, type)` e `record(...)`.
    // Também marque parcelas ISSUED com due_date < hoje como OVERDUE aqui (ou num use-case separado).
    throw new Error('TODO: SendRemindersUseCase');
  }
}
