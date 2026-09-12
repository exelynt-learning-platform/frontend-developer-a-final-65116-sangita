import { describe, it, expect, vi } from 'vitest';
import { resolveListState } from '../features/employees/listViewState';
import type { Employee } from '../types';

const employee: Employee = {
  id: '1',
  name: 'Sangita Zare',
  email: 'sangita@example.com',
  mobile: '9876543210',
  country: 'India',
  state: 'Maharashtra',
  district: 'Pune',
};

const retry = {
  onRetryEmployees: vi.fn(),
  onRetryCountries: vi.fn(),
  onRetrySearch: vi.fn(),
};

describe('resolveListState', () => {
  it('returns loading while employees or countries are fetching', () => {
    expect(
      resolveListState({
        loading: true,
        countriesLoading: false,
        error: null,
        countriesError: null,
        searchStatus: 'idle',
        searchError: null,
        displayedEmployees: [employee],
        ...retry,
      }).type
    ).toBe('loading');
  });

  it('returns a retryable error when the employee fetch failed', () => {
    const view = resolveListState({
      loading: false,
      countriesLoading: false,
      error: 'Network down',
      countriesError: null,
      searchStatus: 'idle',
      searchError: null,
      displayedEmployees: [],
      ...retry,
    });

    expect(view).toMatchObject({ type: 'error', message: 'Network down' });
  });

  it('returns empty when the list is idle and has no employees', () => {
    const view = resolveListState({
      loading: false,
      countriesLoading: false,
      error: null,
      countriesError: null,
      searchStatus: 'idle',
      searchError: null,
      displayedEmployees: [],
      ...retry,
    });

    expect(view).toEqual({
      type: 'empty',
      description: 'No employees yet. Add one to get started.',
    });
  });

  it('returns ready with the displayed employees', () => {
    const view = resolveListState({
      loading: false,
      countriesLoading: false,
      error: null,
      countriesError: null,
      searchStatus: 'idle',
      searchError: null,
      displayedEmployees: [employee],
      ...retry,
    });

    expect(view).toEqual({ type: 'ready', employees: [employee] });
  });

  it('returns a search not-found empty state', () => {
    const view = resolveListState({
      loading: false,
      countriesLoading: false,
      error: null,
      countriesError: null,
      searchStatus: 'not_found',
      searchError: 'No employee found with ID "9999".',
      displayedEmployees: [],
      ...retry,
    });

    expect(view).toEqual({
      type: 'empty',
      description: 'No employee found with ID "9999".',
    });
  });

  it('falls back to a generic not-found description when searchError is missing', () => {
    const view = resolveListState({
      loading: false,
      countriesLoading: false,
      error: null,
      countriesError: null,
      searchStatus: 'not_found',
      searchError: null,
      displayedEmployees: [],
      ...retry,
    });

    expect(view).toEqual({
      type: 'empty',
      description: 'No employee found with that ID.',
    });
  });

  it('returns a retryable error when countries fail to load', () => {
    const view = resolveListState({
      loading: false,
      countriesLoading: false,
      error: null,
      countriesError: 'Countries unavailable',
      searchStatus: 'idle',
      searchError: null,
      displayedEmployees: [employee],
      ...retry,
    });

    expect(view).toMatchObject({ type: 'error', message: 'Countries unavailable' });
  });

  it('returns loading while a search is in flight', () => {
    expect(
      resolveListState({
        loading: false,
        countriesLoading: false,
        error: null,
        countriesError: null,
        searchStatus: 'loading',
        searchError: null,
        displayedEmployees: [],
        ...retry,
      })
    ).toEqual({ type: 'loading', tip: 'Searching...' });
  });

  it('returns a search error with a fallback message', () => {
    const view = resolveListState({
      loading: false,
      countriesLoading: false,
      error: null,
      countriesError: null,
      searchStatus: 'error',
      searchError: null,
      displayedEmployees: [],
      ...retry,
    });

    expect(view).toMatchObject({
      type: 'error',
      message: 'Something went wrong while searching.',
    });
  });

  it('returns the generic not-found empty state for a found search without a result', () => {
    const view = resolveListState({
      loading: false,
      countriesLoading: false,
      error: null,
      countriesError: null,
      searchStatus: 'found',
      searchError: null,
      displayedEmployees: [],
      ...retry,
    });

    expect(view).toEqual({
      type: 'empty',
      description: 'No employee found with that ID.',
    });
  });

  it('returns loading while countries are fetching', () => {
    expect(
      resolveListState({
        loading: false,
        countriesLoading: true,
        error: null,
        countriesError: null,
        searchStatus: 'idle',
        searchError: null,
        displayedEmployees: [employee],
        ...retry,
      }).type
    ).toBe('loading');
  });
});
