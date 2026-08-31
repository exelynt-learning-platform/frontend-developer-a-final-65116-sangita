import { apiClient } from '../../api/client';
import type { Employee, EmployeeFormValues } from '../../types';

export const employeesAPI = {
  getAll: async (): Promise<Employee[]> => {
    const { data } = await apiClient.get<Employee[]>('/employee');
    return data;
  },

  getById: async (id: string): Promise<Employee> => {
    const { data } = await apiClient.get<Employee>(`/employee/${id}`);
    return data;
  },

  create: async (payload: EmployeeFormValues): Promise<Employee> => {
    const { data } = await apiClient.post<Employee>('/employee', payload);
    return data;
  },

  update: async (id: string, payload: EmployeeFormValues): Promise<Employee> => {
    const { data } = await apiClient.put<Employee>(`/employee/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<string> => {
    await apiClient.delete(`/employee/${id}`);
    return id;
  },
};
