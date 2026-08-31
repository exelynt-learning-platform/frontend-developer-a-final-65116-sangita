import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { AxiosError, AxiosHeaders } from 'axios';
import employeesReducer, {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployeeById,
  clearSearch,
} from '../features/employees/employeesSlice';
import { employeesAPI } from '../features/employees/employeesAPI';
import type { Employee } from '../types';

function axios404() {
  return new AxiosError(
    'Request failed with status code 404',
    'ERR_BAD_REQUEST',
    { headers: new AxiosHeaders() },
    {},
    {
      status: 404,
      statusText: 'Not Found',
      data: null,
      headers: {},
      config: { headers: new AxiosHeaders() },
    }
  );
}

function axios500() {
  return new AxiosError(
    'Request failed with status code 500',
    'ERR_BAD_RESPONSE',
    { headers: new AxiosHeaders() },
    {},
    {
      status: 500,
      statusText: 'Internal Server Error',
      data: null,
      headers: {},
      config: { headers: new AxiosHeaders() },
    }
  );
}

vi.mock('../features/employees/employeesAPI');

const mockEmployee: Employee = {
  id: '1',
  name: 'Sangita Zare',
  email: 'sangita@example.com',
  mobile: '9876543210',
  country: 'IN',
  state: 'Maharashtra',
  district: 'Pune',
};

function setupStore() {
  return configureStore({ reducer: { employees: employeesReducer } });
}

describe('employeesSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets loading true while fetchEmployees is pending, then populates list on success', async () => {
    vi.mocked(employeesAPI.getAll).mockResolvedValueOnce([mockEmployee]);
    const store = setupStore();

    const promise = store.dispatch(fetchEmployees());
    expect(store.getState().employees.loading).toBe(true);

    await promise;

    const state = store.getState().employees;
    expect(state.loading).toBe(false);
    expect(state.list).toEqual([mockEmployee]);
    expect(state.error).toBeNull();
  });

  it('sets an error message when fetchEmployees fails', async () => {
    vi.mocked(employeesAPI.getAll).mockRejectedValueOnce(new Error('Network down'));
    const store = setupStore();

    await store.dispatch(fetchEmployees());

    const state = store.getState().employees;
    expect(state.loading).toBe(false);
    expect(state.error).toContain('Network down');
    expect(state.list).toEqual([]);
  });

  it('prepends a newly created employee to the list', async () => {
    const newEmployee = { ...mockEmployee, id: '2', name: 'New Hire' };
    vi.mocked(employeesAPI.create).mockResolvedValueOnce(newEmployee);
    const store = setupStore();

    await store.dispatch(
      createEmployee({
        name: 'New Hire',
        email: 'new@example.com',
        mobile: '9999999999',
        country: 'IN',
        state: 'Maharashtra',
        district: 'Pune',
      })
    );

    expect(store.getState().employees.list[0]).toEqual(newEmployee);
  });

  it('replaces the matching employee in the list on update', async () => {
    const updated = { ...mockEmployee, name: 'Updated Name' };
    vi.mocked(employeesAPI.update).mockResolvedValueOnce(updated);

    const store = configureStore({
      reducer: { employees: employeesReducer },
      preloadedState: { employees: { ...employeesReducer(undefined, { type: '@@init' }), list: [mockEmployee] } },
    });

    await store.dispatch(updateEmployee({ id: '1', payload: updated }));

    expect(store.getState().employees.list[0].name).toBe('Updated Name');
  });

  it('removes the employee from the list on successful delete', async () => {
    vi.mocked(employeesAPI.remove).mockResolvedValueOnce('1');

    const store = configureStore({
      reducer: { employees: employeesReducer },
      preloadedState: { employees: { ...employeesReducer(undefined, { type: '@@init' }), list: [mockEmployee] } },
    });

    await store.dispatch(deleteEmployee('1'));

    expect(store.getState().employees.list).toEqual([]);
  });

  it('marks searchStatus as found when searchEmployeeById succeeds', async () => {
    vi.mocked(employeesAPI.getById).mockResolvedValueOnce(mockEmployee);
    const store = setupStore();

    await store.dispatch(searchEmployeeById('1'));

    const state = store.getState().employees;
    expect(state.searchStatus).toBe('found');
    expect(state.searchResult).toEqual(mockEmployee);
  });

  it('marks searchStatus as not_found and shows a friendly message on a real 404', async () => {
    vi.mocked(employeesAPI.getById).mockRejectedValueOnce(axios404());
    const store = setupStore();

    await store.dispatch(searchEmployeeById('9999'));

    const state = store.getState().employees;
    expect(state.searchStatus).toBe('not_found');
    expect(state.searchResult).toBeNull();
    expect(state.searchError).not.toContain('Request failed');
    expect(state.searchError).toBe('No employee found with ID "9999".');
  });

  it('marks searchStatus as error (not not_found) on a genuine server failure', async () => {
    vi.mocked(employeesAPI.getById).mockRejectedValueOnce(axios500());
    const store = setupStore();

    await store.dispatch(searchEmployeeById('1'));

    const state = store.getState().employees;
    expect(state.searchStatus).toBe('error');
    expect(state.searchResult).toBeNull();
    expect(state.searchError).toContain('500');
  });

  it('clearSearch resets search state back to idle', () => {
    const store = setupStore();
    store.dispatch(clearSearch());
    const state = store.getState().employees;
    expect(state.searchStatus).toBe('idle');
    expect(state.searchResult).toBeNull();
  });
});
