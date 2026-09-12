import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchById from '../components/SearchById';

describe('SearchById', () => {
  it('calls onSearch with the trimmed id', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchById onSearch={onSearch} onClear={vi.fn()} loading={false} />);

    await user.type(screen.getByLabelText('Search employee by ID'), '  42  ');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(onSearch).toHaveBeenCalledWith('42');
  });

  it('does not search when the input is empty', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchById onSearch={onSearch} onClear={vi.fn()} loading={false} />);

    await user.type(screen.getByLabelText('Search employee by ID'), '   ');
    await user.keyboard('{Enter}');

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('clears the input and calls onClear', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<SearchById onSearch={vi.fn()} onClear={onClear} loading={false} />);

    await user.type(screen.getByLabelText('Search employee by ID'), '99');
    await user.click(screen.getByRole('button', { name: /clear/i }));

    expect(onClear).toHaveBeenCalled();
    expect(screen.getByLabelText('Search employee by ID')).toHaveValue('');
  });
});
