import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmployeeForm from '../components/EmployeeForm';
import type { Country, Employee } from '../types';

const countries: Country[] = [
  { id: 'c1', country: 'India' },
  { id: 'c2', country: 'United States' },
];

describe('EmployeeForm', () => {
  it('shows required-field errors when submitted empty', async () => {
    const onSubmit = vi.fn();
    render(
      <EmployeeForm countries={countries} submitting={false} onSubmit={onSubmit} onCancel={vi.fn()} />
    );

    await userEvent.click(screen.getByRole('button', { name: /add employee/i }));

    await waitFor(() => {
      expect(screen.getByText('Name is required.')).toBeInTheDocument();
      expect(screen.getByText('Email is required.')).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows an error for an invalid email format', async () => {
    render(<EmployeeForm countries={countries} submitting={false} onSubmit={vi.fn()} onCancel={vi.fn()} />);

    await userEvent.type(screen.getByPlaceholderText(/name@example.com/i), 'not-an-email');
    await userEvent.click(screen.getByRole('button', { name: /add employee/i }));

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    });
  });

  it('pre-populates fields when initialValues (edit mode) is provided', () => {
    const employee: Employee = {
      id: '1',
      name: 'Sangita Zare',
      email: 'sangita@example.com',
      mobile: '9876543210',
      country: 'India',
      state: 'Maharashtra',
      district: 'Pune',
    };

    render(
      <EmployeeForm
        initialValues={employee}
        countries={countries}
        submitting={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByDisplayValue('Sangita Zare')).toBeInTheDocument();
    expect(screen.getByDisplayValue('sangita@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update employee/i })).toBeInTheDocument();
  });

  it('calls onSubmit with form values when all fields are valid', async () => {
    const onSubmit = vi.fn();
    render(<EmployeeForm countries={countries} submitting={false} onSubmit={onSubmit} onCancel={vi.fn()} />);

    await userEvent.type(screen.getByPlaceholderText(/Sangita Zare/i), 'John Doe');
    await userEvent.type(screen.getByPlaceholderText(/name@example.com/i), 'john@example.com');
    await userEvent.type(screen.getByPlaceholderText(/\+919812345678/i), '9876543210');

    await userEvent.click(screen.getByRole('combobox', { name: /country/i }));
    await userEvent.click(await screen.findByTitle('India'));

    await userEvent.type(screen.getByPlaceholderText(/Maharashtra/i), 'Maharashtra');
    await userEvent.type(screen.getByPlaceholderText(/Pune/i), 'Pune');

    await userEvent.click(screen.getByRole('button', { name: /add employee/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          mobile: '9876543210',
          country: 'India',
          state: 'Maharashtra',
          district: 'Pune',
        })
      );
    });
  });

  it('calls onCancel when Cancel is clicked', async () => {
    const onCancel = vi.fn();
    render(<EmployeeForm countries={countries} submitting={false} onSubmit={vi.fn()} onCancel={onCancel} />);

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });
});
