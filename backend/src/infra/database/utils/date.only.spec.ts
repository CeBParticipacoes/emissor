import { describe, expect, it } from 'vitest';

import {
  dateFromDatabase,
  dateToDatabase,
} from './date.only.js';

describe('date.only', () => {
  describe('dateToDatabase', () => {
    it('converte uma data para YYYY-MM-DD', () => {
      const date = new Date('2027-01-10T12:00:00.000Z');

      expect(dateToDatabase(date)).toBe('2027-01-10');
    });

    it('converte para UTC mesmo quando a data atravessa a meia-noite', () => {
      const date = new Date('2027-01-10T23:30:00-03:00');

      expect(dateToDatabase(date)).toBe('2027-01-11');
    });
  });

  describe('dateFromDatabase', () => {
    it('converte YYYY-MM-DD para meia-noite UTC', () => {
      const date = dateFromDatabase('2027-01-10');

      expect(date.toISOString()).toBe('2027-01-10T00:00:00.000Z');
    });
  });
});