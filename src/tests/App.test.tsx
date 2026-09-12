import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../App';
import employeesReducer from '../features/employees/employeesSlice';
import countriesReducer from '../features/countries/countriesSlice';
import { employeesAPI } from '../features/employees/employeesAPI';
import { countriesAPI } from '../features/countries/countriesAPI';

vi.mock('../features/employees/employeesAPI');
vi.mock('../features/countries/countriesAPI');

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(employeesAPI.getAll).mockResolvedValue([]);
    vi.mocked(countriesAPI.getAll).mockResolvedValue([]);
  });

  it('renders the employee management page', async () => {
    const store = configureStore({
      reducer: { employees: employeesReducer, countries: countriesReducer },
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(await screen.findByText('Employee Management')).toBeInTheDocument();
  });
});
