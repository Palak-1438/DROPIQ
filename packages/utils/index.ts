export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US').format(date);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
