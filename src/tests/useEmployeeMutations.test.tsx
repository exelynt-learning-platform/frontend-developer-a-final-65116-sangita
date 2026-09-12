import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useEmployeeMutations, getMutationErrorMessage } from '../features/employees/useEmployeeMutations';
import employeesReducer from '../features/employees/employeesSlice';
import { employeesAPI } from '../features/employees/employeesAPI';
import type { Employee, EmployeeFormValues } from '../types';

vi.mock('../features/employees/employeesAPI');

const formValues: EmployeeFormValues = {
  name: 'New Hire',
  email: 'new@example.com',
  mobile: '9999999999',
  country: 'IN',
  state: 'Maharashtra',
  district: 'Pune',
};

const created: Employee = { id: '2', ...formValues };

function Harness() {
  const { addEmployee, saveEmployee, removeEmployee } = useEmployeeMutations();
  return (
    <div>
      <button onClick={() => addEmployee(formValues)}>add</button>
      <button onClick={() => saveEmployee('1', formValues)}>save</button>
      <button onClick={() => removeEmployee('1')}>remove</button>
    </div>
  );
}

function renderHarness() {
  const store = configureStore({ reducer: { employees: employeesReducer } });
  render(
    <Provider store={store}>
      <Harness />
    </Provider>
  );
  return store;
}

describe('getMutationErrorMessage', () => {
  it('returns the payload message when present', () => {
    expect(getMutationErrorMessage({ message: 'Nope' }, 'fallback')).toBe('Nope');
  });

  it('returns the fallback for empty or non-object values', () => {
    expect(getMutationErrorMessage({ message: '' }, 'fallback')).toBe('fallback');
    expect(getMutationErrorMessage('string-error', 'fallback')).toBe('fallback');
    expect(getMutationErrorMessage(null, 'fallback')).toBe('fallback');
  });
});

describe('useEmployeeMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds an employee and returns true on success', async () => {
    const user = userEvent.setup();
    vi.mocked(employeesAPI.create).mockResolvedValueOnce(created);
    const store = renderHarness();

    await user.click(screen.getByRole('button', { name: 'add' }));

    await waitFor(() => expect(store.getState().employees.list[0]).toEqual(created));
  });

  it('returns false and stores mutationError when create fails', async () => {
    const user = userEvent.setup();
    vi.mocked(employeesAPI.create).mockRejectedValueOnce(new Error('create failed'));
    const store = renderHarness();

    await user.click(screen.getByRole('button', { name: 'add' }));

    await waitFor(() => expect(store.getState().employees.mutationError).toContain('create failed'));
  });

  it('updates an employee on success', async () => {
    const user = userEvent.setup();
    const updated = { id: '1', ...formValues, name: 'Updated' };
    vi.mocked(employeesAPI.update).mockResolvedValueOnce(updated);
    const store = renderHarness();

    await user.click(screen.getByRole('button', { name: 'save' }));

    await waitFor(() => expect(employeesAPI.update).toHaveBeenCalled());
    expect(store.getState().employees.mutationError).toBeNull();
  });

  it('stores mutationError when update fails', async () => {
    const user = userEvent.setup();
    vi.mocked(employeesAPI.update).mockRejectedValueOnce(new Error('update failed'));
    const store = renderHarness();

    await user.click(screen.getByRole('button', { name: 'save' }));

    await waitFor(() => expect(store.getState().employees.mutationError).toContain('update failed'));
  });

  it('removes an employee on success', async () => {
    const user = userEvent.setup();
    vi.mocked(employeesAPI.remove).mockResolvedValueOnce('1');
    renderHarness();

    await user.click(screen.getByRole('button', { name: 'remove' }));

    await waitFor(() => expect(employeesAPI.remove).toHaveBeenCalledWith('1'));
  });

  it('stores mutationError when delete fails', async () => {
    const user = userEvent.setup();
    vi.mocked(employeesAPI.remove).mockRejectedValueOnce(new Error('delete failed'));
    const store = renderHarness();

    await user.click(screen.getByRole('button', { name: 'remove' }));

    await waitFor(() => expect(store.getState().employees.mutationError).toContain('delete failed'));
  });
});
