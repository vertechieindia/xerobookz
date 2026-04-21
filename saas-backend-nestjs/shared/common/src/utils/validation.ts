import { validate as uuidValidate } from 'uuid';

export function isValidUUID(str: string): boolean {
  return uuidValidate(str);
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}
