export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function isValidLength(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max;
}

export function sanitizeString(value: string, maxLength: number = 1000): string {
  return value.trim().substring(0, maxLength).replace(/[<>]/g, '');
}
