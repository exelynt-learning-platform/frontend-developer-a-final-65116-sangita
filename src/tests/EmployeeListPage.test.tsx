import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { AxiosError, AxiosHeaders } from 'axios';
import EmployeeListPage from '../features/employees/EmployeeListPage';
import employeesReducer from '../features/employees/employeesSlice';
import countriesReducer from '../features/countries/countriesSlice';
import { employeesAPI } from '../features/employees/employeesAPI';
import { countriesAPI } from '../features/countries/countriesAPI';
import type { Employee, Country } from '../types';

vi.mock('../features/employees/employeesAPI');
vi.mock('../features/countries/countriesAPI');

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Sangita Zare',
    email: 'sangita@example.com',
    mobile: '9876543210',
    country: 'India',
    state: 'Maharashtra',
    district: 'Pune',
  },
];

const mockCountries: Country[] = [{ id: '1', country: 'India' }];

function axios404() {
  return new AxiosError(
    'Request failed with status code 404',
    'ERR_BAD_REQUEST',
    { headers: new AxiosHeaders() },
    {},
    { status: 404, statusText: 'Not Found', data: null, headers: {}, config: { headers: new AxiosHeaders() } }
  );
}

function renderPage() {
  const store = configureStore({
    reducer: { employees: employeesReducer, countries: countriesReducer },
  });
  render(
    <Provider store={store}>
      <EmployeeListPage />
    </Provider>
  );
  return store;
}

describe('EmployeeListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(employeesAPI.getAll).mockResolvedValue(mockEmployees);
    vi.mocked(countriesAPI.getAll).mockResolvedValue(mockCountries);
  });

  it('loads and displays employees from the API on mount', async () => {
    renderPage();

    expect(await screen.findByText('Sangita Zare')).toBeInTheDocument();
    expect(screen.getByText('sangita@example.com')).toBeInTheDocument();
  });

  it('shows a friendly "not found" message (not the raw API error) when searching an unknown ID', async () => {
    const user = userEvent.setup();
    vi.mocked(employeesAPI.getById).mockRejectedValueOnce(axios404());
    renderPage();

    await screen.findByText('Sangita Zare');

    await user.type(screen.getByLabelText('Search employee by ID'), '9999');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText('No employee found with ID "9999".')).toBeInTheDocument();
    });
    expect(screen.queryByText(/Request failed/i)).not.toBeInTheDocument();
  });

  it('shows only the matching employee when search succeeds', async () => {
    const user = userEvent.setup();
    vi.mocked(employeesAPI.getById).mockResolvedValueOnce(mockEmployees[0]);
    renderPage();

    await screen.findByText('Sangita Zare');

    await user.type(screen.getByLabelText('Search employee by ID'), '1');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getAllByText('Sangita Zare')).toHaveLength(1);
    });
  });

  it('asks for confirmation before deleting, and only deletes after confirming', async () => {
    const user = userEvent.setup();
    vi.mocked(employeesAPI.remove).mockResolvedValueOnce('1');
    renderPage();

    await screen.findByText('Sangita Zare');
    await user.click(screen.getByRole('button', { name: 'Delete Sangita Zare' }));

    expect(await screen.findByText('Delete employee')).toBeInTheDocument();
    expect(employeesAPI.remove).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => expect(employeesAPI.remove).toHaveBeenCalledWith('1'));
  });

  it('shows an empty state when the API returns no employees', async () => {
    vi.mocked(employeesAPI.getAll).mockResolvedValue([]);
    renderPage();

    expect(await screen.findByText('No employees yet. Add one to get started.')).toBeInTheDocument();
  });

  it('shows a retryable error state when the initial employee fetch fails', async () => {
    vi.mocked(employeesAPI.getAll).mockRejectedValueOnce(new Error('Network down'));
    renderPage();

    expect(await screen.findByText(/Network down/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });
});
