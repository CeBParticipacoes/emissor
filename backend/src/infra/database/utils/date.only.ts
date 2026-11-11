export function dateToDatabase(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function dateFromDatabase(value: Date | string): Date {
  const dateString =
    value instanceof Date
      ? [
          value.getUTCFullYear(),
          String(value.getUTCMonth() + 1).padStart(2, '0'),
          String(value.getUTCDate()).padStart(2, '0'),
        ].join('-')
      : value.slice(0, 10);

  const [year, month, day] = dateString.split('-').map(Number);

  return new Date(Date.UTC(year, month - 1, day));
}