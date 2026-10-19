import { Inject, Injectable } from '@nestjs/common';
import { BANK_GATEWAY, type BankGateway } from '../ports/bank-gateway.js';
import { EMAIL_SENDER, type EmailSender } from '../ports/email-sender.js';
import { INSTALLMENT_REPOSITORY, type InstallmentRepository } from '../ports/repositories.js';

/**
 * O Cora avisa "algo mudou no boleto X". Não confiamos no aviso:
 * consultamos o boleto e só então marcamos como pago.
 * Deve ser idempotente: receber o mesmo evento duas vezes não quebra nada.
 */
@Injectable()
export class HandleCoraWebhookUseCase {
  constructor(
    @Inject(INSTALLMENT_REPOSITORY) private readonly installments: InstallmentRepository,
    @Inject(BANK_GATEWAY) private readonly bank: BankGateway,
    @Inject(EMAIL_SENDER) private readonly email: EmailSender,
  ) {}

  async execute(_input: { eventType: string; coraInvoiceId: string }): Promise<void> {
    // TODO:
    // 1. installments.findByCoraInvoiceId(); se não achar, só loga e retorna (pode ser boleto manual).
    // 2. Se já está PAID, retorna (idempotência).
    // 3. bank.getInvoiceStatus(); se 'PAID': parcela.markPaid(paidAt); save; e-mail de confirmação.
    throw new Error('TODO: HandleCoraWebhookUseCase');
  }
}
