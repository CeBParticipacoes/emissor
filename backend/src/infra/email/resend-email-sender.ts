import { Inject, Injectable } from '@nestjs/common';
import type { EmailMessage, EmailSender } from '../../application/ports/email-sender.js';
import { ENV, type Env } from '../config/env.js';

/** Implementa EmailSender com o Resend (https://resend.com/docs). */
@Injectable()
export class ResendEmailSender implements EmailSender {
  constructor(@Inject(ENV) private readonly env: Env) {}

  async send(_message: EmailMessage): Promise<{ messageId: string }> {
    // TODO: const resend = new Resend(env.RESEND_API_KEY);
    //       const { data } = await resend.emails.send({ from: env.EMAIL_FROM, to, subject, text });
    //       return { messageId: data.id };
    throw new Error('TODO: ResendEmailSender.send');
  }
}
