import { Inject, Injectable } from '@nestjs/common';
import { BANK_GATEWAY, type BankGateway } from '../ports/bank-gateway.js';
import { EMAIL_SENDER, type EmailSender } from '../ports/email-sender.js';
import { CLOCK, type Clock } from '../ports/clock.js';
import { INSTALLMENT_REPOSITORY, type InstallmentRepository } from '../ports/repositories.js';

/**
 * Roda todo dia (infra/scheduling). Emite no Cora as parcelas que vencem
 * nos próximos N dias e manda o e-mail com o boleto.
 */
@Injectable()
export class IssueDueInstallmentsUseCase {
  constructor(
    @Inject(INSTALLMENT_REPOSITORY) private readonly installments: InstallmentRepository,
    @Inject(BANK_GATEWAY) private readonly bank: BankGateway,
    @Inject(EMAIL_SENDER) private readonly email: EmailSender,
    @Inject(CLOCK) private readonly clock: Clock,
  ) {}

  async execute(): Promise<{ issued: number; failed: number }> {
    // TODO:
    // 1. limite = hoje + ISSUE_DAYS_BEFORE_DUE.
    // 2. installments.findPendingDueUntil(limite).
    // 3. Para cada parcela, em try/catch:
    //    - bank.issueInvoice({ idempotencyKey: parcela.idempotencyKey, ... })
    //    - parcela.markIssued(resultado, hoje); installments.save(parcela)
    //    - email.send(boleto emitido)
    //    catch: parcela.markIssueFailed(erro.message, MAX_ISSUE_ATTEMPTS); save;
    //           se virou ISSUE_FAILED, email interno para INTERNAL_ALERT_EMAIL.
    // Importante: uma parcela falhando NÃO pode impedir as outras (por isso try/catch dentro do loop).
    throw new Error('TODO: IssueDueInstallmentsUseCase');
  }
}
