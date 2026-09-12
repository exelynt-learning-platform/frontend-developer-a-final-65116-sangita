import { apiClient } from '../../api/client';
import type { Country } from '../../types';

export const countriesAPI = {
  getAll: async (): Promise<Country[]> => {
    const { data } = await apiClient.get<Country[]>('/country');
    return data;
  },
};
