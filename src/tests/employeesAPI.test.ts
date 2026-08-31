import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '../api/client';
import { employeesAPI } from '../features/employees/employeesAPI';
import type { Employee } from '../types';

vi.mock('../api/client', async () => {
  const actual = await vi.importActual<typeof import('../api/client')>('../api/client');
  return {
    ...actual,
    apiClient: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    },
  };
});

const mockEmployee: Employee = {
  id: '1',
  name: 'Sangita Zare',
  email: 'sangita@example.com',
  mobile: '9876543210',
  country: 'IN',
  state: 'Maharashtra',
  district: 'Pune',
};

describe('employeesAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAll calls GET /employee and returns the list', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: [mockEmployee] });
    const result = await employeesAPI.getAll();
    expect(apiClient.get).toHaveBeenCalledWith('/employee');
    expect(result).toEqual([mockEmployee]);
  });

  it('getById calls GET /employee/:id', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockEmployee });
    const result = await employeesAPI.getById('1');
    expect(apiClient.get).toHaveBeenCalledWith('/employee/1');
    expect(result).toEqual(mockEmployee);
  });

  it('create calls POST /employee with the payload', async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockEmployee });
    const payload = {
      name: mockEmployee.name,
      email: mockEmployee.email,
      mobile: mockEmployee.mobile,
      country: mockEmployee.country,
      state: mockEmployee.state,
      district: mockEmployee.district,
    };
    const result = await employeesAPI.create(payload);
    expect(apiClient.post).toHaveBeenCalledWith('/employee', payload);
    expect(result).toEqual(mockEmployee);
  });

  it('update calls PUT /employee/:id with the payload', async () => {
    vi.mocked(apiClient.put).mockResolvedValueOnce({ data: mockEmployee });
    const { id, ...payload } = mockEmployee;
    const result = await employeesAPI.update(id, payload);
    expect(apiClient.put).toHaveBeenCalledWith('/employee/1', payload);
    expect(result).toEqual(mockEmployee);
  });

  it('remove calls DELETE /employee/:id and returns the id', async () => {
    vi.mocked(apiClient.delete).mockResolvedValueOnce({});
    const result = await employeesAPI.remove('1');
    expect(apiClient.delete).toHaveBeenCalledWith('/employee/1');
    expect(result).toBe('1');
  });
});
