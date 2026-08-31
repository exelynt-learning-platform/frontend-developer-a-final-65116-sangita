const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^\+?[0-9]{7,15}$/;

export function isRequired(value: string | undefined | null): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

export function isValidMobile(value: string): boolean {
  return MOBILE_REGEX.test(value.trim());
}

export function isValidLength(value: string, min: number, max: number): boolean {
  const len = value.trim().length;
  return len >= min && len <= max;
}

export const FIELD_LIMITS = {
  name: { min: 2, max: 50 },
  mobile: { min: 7, max: 15 },
  state: { min: 2, max: 50 },
  district: { min: 2, max: 50 },
} as const;

export const VALIDATION_MESSAGES = {
  required: (field: string) => `${field} is required.`,
  email: 'Please enter a valid email address.',
  mobile: 'Please enter a valid mobile number (7-15 digits).',
  length: (field: string, min: number, max: number) =>
    `${field} must be between ${min} and ${max} characters.`,
};
