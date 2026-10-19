import { calculateInstallmentSchedule } from './installment-schedule-calculator.js';

describe('calculateInstallmentSchedule', () => {
  it('divide o valor e joga os centavos de sobra na última parcela', () => {
    const result = calculateInstallmentSchedule({
      totalAmountCents: 100_000, // R$ 1.000,00
      installmentsCount: 3,
      dueDay: 10,
      firstDueDate: new Date('2026-01-10'),
    });
    expect(result.map((r) => r.amountCents)).toEqual([33_333, 33_333, 33_334]);
  });

  it('usa o último dia do mês quando o dia 31 não existe', () => {
    const result = calculateInstallmentSchedule({
      totalAmountCents: 1_200,
      installmentsCount: 3,
      dueDay: 31,
      firstDueDate: new Date('2026-01-01'),
    });
    expect(result.map((r) => r.dueDate.toISOString().slice(0, 10))).toEqual([
      '2026-01-31',
      '2026-02-28',
      '2026-03-31',
    ]);
  });

  it('vira o ano corretamente', () => {
    const result = calculateInstallmentSchedule({
      totalAmountCents: 1_200,
      installmentsCount: 2,
      dueDay: 5,
      firstDueDate: new Date('2026-12-01'),
    });
    expect(result[1].dueDate.toISOString().slice(0, 10)).toBe('2027-01-05');
  });
});
