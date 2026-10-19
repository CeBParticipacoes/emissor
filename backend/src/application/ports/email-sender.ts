export const EMAIL_SENDER = Symbol('EmailSender');

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
}

export interface EmailSender {
  /** Devolve o id da mensagem no provedor (Resend), para auditoria. */
  send(message: EmailMessage): Promise<{ messageId: string }>;
}
