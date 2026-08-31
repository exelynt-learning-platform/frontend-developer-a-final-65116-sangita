import { describe, it, expect } from 'vitest';
import { isRequired, isValidEmail, isValidMobile, isValidLength } from '../utils/validation';

describe('validation utils', () => {
  describe('isRequired', () => {
    it('returns false for empty, whitespace-only, undefined, or null', () => {
      expect(isRequired('')).toBe(false);
      expect(isRequired('   ')).toBe(false);
      expect(isRequired(undefined)).toBe(false);
      expect(isRequired(null)).toBe(false);
    });

    it('returns true for a non-empty string', () => {
      expect(isRequired('Sangita')).toBe(true);
    });
  });

  describe('isValidEmail', () => {
    it('accepts well-formed emails', () => {
      expect(isValidEmail('sangita@example.com')).toBe(true);
      expect(isValidEmail('name.surname@company.co.in')).toBe(true);
    });

    it('rejects malformed emails', () => {
      expect(isValidEmail('not-an-email')).toBe(false);
      expect(isValidEmail('missing@domain')).toBe(false);
      expect(isValidEmail('@no-local-part.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidMobile', () => {
    it('accepts valid mobile numbers with or without country code', () => {
      expect(isValidMobile('9876543210')).toBe(true);
      expect(isValidMobile('+919876543210')).toBe(true);
    });

    it('rejects too-short, too-long, or non-numeric input', () => {
      expect(isValidMobile('12345')).toBe(false);
      expect(isValidMobile('1234567890123456')).toBe(false);
      expect(isValidMobile('abcdefghij')).toBe(false);
    });
  });

  describe('isValidLength', () => {
    it('accepts values within the given bounds', () => {
      expect(isValidLength('Pune', 2, 50)).toBe(true);
    });

    it('rejects values shorter than min or longer than max', () => {
      expect(isValidLength('P', 2, 50)).toBe(false);
      expect(isValidLength('a'.repeat(51), 2, 50)).toBe(false);
    });
  });
});
