import { describe, expect, it } from 'vitest';
import { Installment, type InstallmentStatus } from './installment.js';

function buildInstallment(
  overrides: Partial<{
    id: string;
    dueDate: Date;
    status: InstallmentStatus;
    issueAttempts: number;
    lastIssueError: string | null;
  }> = {},
) {
  const {
    id = 'installment-1',
    dueDate = new Date('2026-11-01T00:00:00.000Z'),
    status = 'PENDING',
    issueAttempts = 0,
    lastIssueError = null,
  } = overrides;

  return new Installment(
    id,
    'contract-1',
    1,
    10000,
    dueDate,
    status,
    'idempotency-key-1',
    null,
    null,
    null,
    null,
    issueAttempts,
    lastIssueError,
  );
}

function buildIssueData() {
  return {
    coraInvoiceId: 'cora-invoice-1',
    bankSlipUrl: 'https://example.com/boleto',
    digitableLine: '123456789',
    pixEmv: null,
  };
}

describe('Installment', () => {
  it('registra a emissão bem-sucedida de uma parcela', () => {
    const installment = buildInstallment();
    const now = new Date('2026-10-22T12:00:00.000Z');

    installment.markIssued(buildIssueData(), now);

    expect(installment.status).toBe('ISSUED');
    expect(installment.coraInvoiceId).toBe('cora-invoice-1');
    expect(installment.bankSlipUrl).toBe('https://example.com/boleto');
    expect(installment.digitableLine).toBe('123456789');
    expect(installment.pixEmv).toBeNull();
    expect(installment.issuedAt).toBe(now);
  });

  it('rejeita a emissão de uma parcela que não está pendente', () => {
    const installment = buildInstallment({ status: 'ISSUED' });

    expect(() =>
      installment.markIssued(
        buildIssueData(),
        new Date('2026-10-22T12:00:00.000Z'),
      ),
    ).toThrow('Não é possível emitir uma parcela com status ISSUED');
  });

  it('registra uma falha de emissão quando ainda há tentativas disponíveis', () => {
    const installment = buildInstallment();

    installment.markIssueFailed('Erro de conexão com o Cora', 3);

    expect(installment.status).toBe('PENDING');
    expect(installment.issueAttempts).toBe(1);
    expect(installment.lastIssueError).toBe('Erro de conexão com o Cora');
  });

  it('registra o pagamento de uma parcela emitida', () => {
    const installment = buildInstallment({ status: 'ISSUED' });
    const paidAt = new Date('2026-10-25T12:00:00.000Z');

    installment.markPaid(paidAt);

    expect(installment.status).toBe('PAID');
    expect(installment.paidAt).toBe(paidAt);
  });

  it('marca como vencida uma parcela emitida cujo vencimento passou', () => {
    const installment = buildInstallment({
      status: 'ISSUED',
      dueDate: new Date('2026-10-20T00:00:00.000Z'),
    });

    const today = new Date('2026-10-22T12:00:00.000Z');

    installment.markOverdue(today);

    expect(installment.status).toBe('OVERDUE');
  });

  it('não marca como vencida uma parcela no próprio dia do vencimento', () => {
    const installment = buildInstallment({ status: 'ISSUED' });
    const today = new Date('2026-11-01T06:00:00.000Z');

    expect(() => installment.markOverdue(today)).toThrow(
      'Não é possível marcar como vencida uma parcela antes do vencimento',
    );

    expect(installment.status).toBe('ISSUED');
  });

  it('cancela uma parcela pendente e registra a data do cancelamento', () => {
    const installment = buildInstallment();
    const now = new Date('2026-10-26T12:00:00.000Z');

    installment.cancel(now);

    expect(installment.status).toBe('CANCELLED');
    expect(installment.cancelledAt).toBe(now);
  });

  it('marca ISSUE_FAILED ao atingir o máximo de tentativas', () => {
    const installment = buildInstallment();

    installment.markIssueFailed('timeout', 3);
    installment.markIssueFailed('timeout', 3);
    installment.markIssueFailed('timeout', 3);

    expect(installment.status).toBe('ISSUE_FAILED');
    expect(installment.issueAttempts).toBe(3);
  });

  it('rejeita falha de emissão quando a parcela não está pendente', () => {
    const installment = buildInstallment({ status: 'ISSUED' });

    expect(() => installment.markIssueFailed('timeout', 3)).toThrow(
      'Não é possível registrar falha de emissão em uma parcela com status ISSUED',
    );
  });

  it('registra o pagamento de uma parcela atrasada', () => {
    const installment = buildInstallment({
      status: 'OVERDUE',
      dueDate: new Date('2026-10-20T00:00:00.000Z'),
    });

    const paidAt = new Date('2026-10-22T12:00:00.000Z');

    installment.markPaid(paidAt);

    expect(installment.status).toBe('PAID');
    expect(installment.paidAt).toBe(paidAt);
  });

  it('rejeita o pagamento de uma parcela pendente', () => {
    const installment = buildInstallment();

    expect(() =>
      installment.markPaid(new Date('2026-10-22T12:00:00.000Z')),
    ).toThrow(
      'Não é possível registrar pagamento de uma parcela com status PENDING',
    );
  });

  it('rejeita marcar como vencida uma parcela antes do vencimento', () => {
    const installment = buildInstallment({ status: 'ISSUED' });

    expect(() =>
      installment.markOverdue(new Date('2026-10-31T12:00:00.000Z')),
    ).toThrow(
      'Não é possível marcar como vencida uma parcela antes do vencimento',
    );
  });

  it.each(['PENDING', 'OVERDUE', 'PAID', 'ISSUE_FAILED', 'CANCELLED'] as const)(
    'rejeita marcar como vencida uma parcela com status %s',
    (status) => {
      const installment = buildInstallment({
        status,
        dueDate: new Date('2026-10-20T00:00:00.000Z'),
      });

      expect(() =>
        installment.markOverdue(new Date('2026-10-22T12:00:00.000Z')),
      ).toThrow(
        `Não é possível marcar como vencida uma parcela com status ${status}`,
      );
    },
  );

  it.each(['PAID', 'CANCELLED'] as const)(
    'rejeita cancelar uma parcela com status %s',
    (status) => {
      const installment = buildInstallment({ status });
      const now = new Date('2026-10-26T12:00:00.000Z');

      const expectedMessage =
        status === 'PAID'
          ? 'Não é possível cancelar uma parcela com status PAID'
          : 'Não é possível cancelar uma parcela com status CANCELLED';

      expect(() => installment.cancel(now)).toThrow(expectedMessage);
    },
  );

  it('permite tentar novamente a emissão de uma parcela com falha', () => {
    const installment = buildInstallment({
      status: 'ISSUE_FAILED',
      issueAttempts: 3,
      lastIssueError: 'Erro de conexão com o Cora',
    });

    installment.retryIssue();

    expect(installment.status).toBe('PENDING');
    expect(installment.issueAttempts).toBe(0);
    expect(installment.lastIssueError).toBeNull();
  });

  it('rejeita tentar novamente a emissão quando a parcela não está em ISSUE_FAILED', () => {
    const installment = buildInstallment();

    expect(() => installment.retryIssue()).toThrow(
      'Não é possível tentar novamente uma parcela com status PENDING',
    );
  });
});
