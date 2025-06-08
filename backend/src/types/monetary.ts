export type MonetaryValue = string;

export function parseMonetaryValue(value: string): MonetaryValue {
  const parsed = parseFloat(value);
  if (isNaN(parsed)) {
    throw new Error('Invalid monetary value');
  }
  return parsed.toFixed(2);
}

export function formatMonetaryValue(value: string): string {
  return parseFloat(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
}
