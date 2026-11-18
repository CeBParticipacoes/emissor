const ISO_DATE_LENGTH = 10;

export function dateToDatabase(value: Date): string {
  return value.toISOString().slice(0, ISO_DATE_LENGTH);
}

export function dateFromDatabase(value: string): Date {
  const [year, month, day] = value
    .slice(0, ISO_DATE_LENGTH)
    .split('-')
    .map(Number);

  return new Date(Date.UTC(year, month - 1, day));
}