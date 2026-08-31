import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmployeeTable from '../components/EmployeeTable';
import type { Employee } from '../types';

const employees: Employee[] = [
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

describe('EmployeeTable', () => {
  it('renders employee rows with the country name', () => {
    render(<EmployeeTable employees={employees} onEdit={vi.fn()} onDeleteRequest={vi.fn()} />);

    expect(screen.getByText('Sangita Zare')).toBeInTheDocument();
    expect(screen.getByText('sangita@example.com')).toBeInTheDocument();
    expect(screen.getByText('India')).toBeInTheDocument();
  });

  it('calls onEdit with the correct employee when Edit is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<EmployeeTable employees={employees} onEdit={onEdit} onDeleteRequest={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /edit sangita zare/i }));
    expect(onEdit).toHaveBeenCalledWith(employees[0]);
  });

  it('calls onDeleteRequest with the correct employee when Delete is clicked', async () => {
    const user = userEvent.setup();
    const onDeleteRequest = vi.fn();
    render(<EmployeeTable employees={employees} onEdit={vi.fn()} onDeleteRequest={onDeleteRequest} />);

    await user.click(screen.getByRole('button', { name: /delete sangita zare/i }));
    expect(onDeleteRequest).toHaveBeenCalledWith(employees[0]);
  });

  it('renders each distinct country value as provided', () => {
    render(
      <EmployeeTable
        employees={[{ ...employees[0], country: 'Some Country' }]}
        onEdit={vi.fn()}
        onDeleteRequest={vi.fn()}
      />
    );
    expect(screen.getByText('Some Country')).toBeInTheDocument();
  });
});

