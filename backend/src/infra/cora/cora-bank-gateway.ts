import { Inject, Injectable } from '@nestjs/common';
import type { BankGateway, IssueInvoiceInput, IssuedInvoice, InvoiceStatus } from '../../application/ports/bank-gateway.js';
import { ENV, type Env } from '../config/env.js';

/**
 * Implementa BankGateway falando com a API do Cora.
 * Docs: https://developers.cora.com.br
 *
 * Autenticação é mTLS + client_credentials:
 *   const agent = new https.Agent({ cert: fs.readFileSync(CORA_CERT_PATH), key: fs.readFileSync(CORA_KEY_PATH) });
 *   POST CORA_TOKEN_URL, body form-urlencoded: grant_type=client_credentials&client_id=...
 *   → { access_token, expires_in: 86400 }. Guarde em memória e renove quando expirar.
 *
 * Emissão: POST {CORA_BASE_URL}/v2/invoices, header Idempotency-Key, Bearer token.
 * Valores em CENTAVOS. due_date no formato YYYY-MM-DD.
 */
@Injectable()
export class CoraBankGateway implements BankGateway {
  constructor(@Inject(ENV) private readonly env: Env) {}

  async issueInvoice(_input: IssueInvoiceInput): Promise<IssuedInvoice> {
    // TODO: montar o body conforme docs/ARQUITETURA.md (seção "API do Cora") e chamar com axios.
    // Mapear a resposta: id → coraInvoiceId, payment_options.bank_slip.url/digitable, pix.emv.
    throw new Error('TODO: CoraBankGateway.issueInvoice');
  }

  async getInvoiceStatus(_coraInvoiceId: string): Promise<{ status: InvoiceStatus; paidAt: Date | null }> {
    // TODO: GET /v2/invoices/{id}. `payments[0].paid_at` quando status PAID (confira o nome do campo na doc).
    throw new Error('TODO: CoraBankGateway.getInvoiceStatus');
  }

  async cancelInvoice(_coraInvoiceId: string): Promise<void> {
    // TODO: endpoint "Cancelamento de boleto v2".
    throw new Error('TODO: CoraBankGateway.cancelInvoice');
  }
}
