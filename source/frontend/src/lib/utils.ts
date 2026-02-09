import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `£${(price / 10).toFixed(1)}m`;
}

export function getPositionName(elementType: number): string {
  const positions: Record<number, string> = {
    1: 'GK',
    2: 'DEF',
    3: 'MID',
    4: 'FWD',
  };
  return positions[elementType] || 'UNK';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    a: 'text-success',
    d: 'text-warning',
    i: 'text-danger',
    s: 'text-danger',
    u: 'text-text-muted',
  };
  return colors[status] || 'text-text-muted';
}
