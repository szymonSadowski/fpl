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

// DEFCON thresholds per position: posId -> DC needed for 2 pts (GK can't earn)
export const DEFCON_THRESHOLD: Record<number, number> = { 2: 10, 3: 12, 4: 12 };

export function calcDefconPts(posId: number, dc: number): number {
  const threshold = DEFCON_THRESHOLD[posId];
  if (!threshold) return 0;
  return Math.floor(dc / threshold) * 2;
}

// FDR difficulty colors
export const FDR_COLORS: Record<number, string> = {
  1: 'bg-green-600 text-white',
  2: 'bg-green-500 text-white',
  3: 'bg-gray-500 text-white',
  4: 'bg-red-500 text-white',
  5: 'bg-red-700 text-white',
};
