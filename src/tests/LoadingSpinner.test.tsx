import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('exposes the tip text to assistive tech and on screen', () => {
    render(<LoadingSpinner tip="Loading employees..." />);

    expect(screen.getByRole('status', { name: 'Loading employees...' })).toBeInTheDocument();
    expect(screen.getByText('Loading employees...')).toBeInTheDocument();
  });
});
