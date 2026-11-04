import { describe, expect, it } from 'vitest';
import { Installment } from './installment.js';

describe('Installment', () => {
  it('registra a emissão bem-sucedida de uma parcela', () => {
    const installment = new Installment(
      'installment-1',
      'contract-1',
      1,
      10000,
      new Date('2026-11-01T00:00:00.000Z'),
      'PENDING',
      'idempotency-key-1',
    );

    const now = new Date('2026-10-22T12:00:00.000Z');

    installment.markIssued(
      {
        coraInvoiceId: 'cora-invoice-1',
        bankSlipUrl: 'https://example.com/boleto',
        digitableLine: '123456789',
        pixEmv: null,
      },
      now,
    );

    expect(installment.status).toBe('ISSUED');
    expect(installment.coraInvoiceId).toBe('cora-invoice-1');
    expect(installment.bankSlipUrl).toBe('https://example.com/boleto');
    expect(installment.digitableLine).toBe('123456789');
    expect(installment.pixEmv).toBeNull();
    expect(installment.issuedAt).toBe(now);
  });

  it('rejeita a emissão de uma parcela que não está pendente', () => {
    const installment = new Installment(
      'installment-1',
      'contract-1',
      1,
      10000,
      new Date('2026-11-01T00:00:00.000Z'),
      'ISSUED',
      'idempotency-key-1',
    );

    expect(() =>
      installment.markIssued(
        {
          coraInvoiceId: 'cora-invoice-1',
          bankSlipUrl: 'https://example.com/boleto',
          digitableLine: '123456789',
          pixEmv: null,
        },
        new Date('2026-10-22T12:00:00.000Z'),
      ),
    ).toThrow('Não é possível emitir uma parcela com status ISSUED');
  });

  it('registra uma falha de emissão quando ainda há tentativas disponíveis', () => {
  const installment = new Installment(
    'installment-1',
    'contract-1',
    1,
    10000,
    new Date('2026-11-01T00:00:00.000Z'),
    'PENDING',
    'idempotency-key-1',
  );

  installment.markIssueFailed('Erro de conexão com o Cora', 3);

  expect(installment.status).toBe('PENDING');
  expect(installment.issueAttempts).toBe(1);
  expect(installment.lastIssueError).toBe('Erro de conexão com o Cora');
});

it('registra o pagamento de uma parcela emitida', () => {
    const installment = new Installment(
      'installment-1',
      'contract-1',
      1,
      10000,
      new Date('2026-11-01T00:00:00.000Z'),
      'ISSUED',
      'idempotency-key-1',
    );

    const paidAt = new Date('2026-10-25T12:00:00.000Z');

    installment.markPaid(paidAt);

    expect(installment.status).toBe('PAID');
    expect(installment.paidAt).toBe(paidAt);
  });

  it('marca como vencida uma parcela emitida cujo vencimento passou', () => {
    const installment = new Installment(
      'installment-1',
      'contract-1',
      1,
      10000,
      new Date('2026-10-20T00:00:00.000Z'),
      'ISSUED',
      'idempotency-key-1',
    );

    const today = new Date('2026-10-22T12:00:00.000Z');

    installment.markOverdue(today);

    expect(installment.status).toBe('OVERDUE');
  });

  it('cancela uma parcela pendente e registra a data do cancelamento', () => {
    const installment = new Installment(
      'installment-1',
      'contract-1',
      1,
      10000,
      new Date('2026-11-01T00:00:00.000Z'),
      'PENDING',
      'idempotency-key-1',
    );

    const now = new Date('2026-10-26T12:00:00.000Z');

    installment.cancel(now);

    expect(installment.status).toBe('CANCELLED');
    expect(installment.cancelledAt).toBe(now);
  });
});