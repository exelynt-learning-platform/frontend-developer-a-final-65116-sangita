import { describe, it, expect, vi } from 'vitest';
import { ensureDeleteTarget } from '../features/employees/deleteGuard';
import type { Employee } from '../types';

const employee: Employee = {
  id: '1',
  name: 'Sangita Zare',
  email: 'sangita@example.com',
  mobile: '9876543210',
  country: 'India',
  state: 'Maharashtra',
  district: 'Pune',
};

describe('ensureDeleteTarget', () => {
  it('returns true when an employee is selected', () => {
    expect(ensureDeleteTarget(employee)).toBe(true);
  });

  it('warns and returns false when no employee is selected', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(ensureDeleteTarget(null)).toBe(false);
    expect(warn).toHaveBeenCalledWith('Delete confirmed with no employee selected.');
    warn.mockRestore();
  });
});
