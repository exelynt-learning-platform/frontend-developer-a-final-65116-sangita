import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '../api/client';
import { countriesAPI } from '../features/countries/countriesAPI';
import type { Country } from '../types';

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

const mockCountries: Country[] = [{ id: '1', country: 'India' }];

describe('countriesAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAll calls GET /country and returns the list', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockCountries });
    const result = await countriesAPI.getAll();
    expect(apiClient.get).toHaveBeenCalledWith('/country');
    expect(result).toEqual(mockCountries);
  });
});
