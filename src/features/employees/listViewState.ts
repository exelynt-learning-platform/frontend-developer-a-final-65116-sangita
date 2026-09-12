import type { Employee, SearchStatus } from '../../types';

export type ListViewState =
  | { type: 'loading'; tip: string }
  | { type: 'error'; message: string; retry: () => void }
  | { type: 'empty'; description: string }
  | { type: 'ready'; employees: Employee[] };

interface ListViewInput {
  loading: boolean;
  countriesLoading: boolean;
  error: string | null;
  countriesError: string | null;
  searchStatus: SearchStatus;
  searchError: string | null;
  displayedEmployees: Employee[];
  onRetryEmployees: () => void;
  onRetryCountries: () => void;
  onRetrySearch: () => void;
}

export function resolveListState(input: ListViewInput): ListViewState {
  if (input.loading || input.countriesLoading) {
    return { type: 'loading', tip: 'Loading employees...' };
  }

  if (input.error) {
    return { type: 'error', message: input.error, retry: input.onRetryEmployees };
  }

  if (input.countriesError) {
    return { type: 'error', message: input.countriesError, retry: input.onRetryCountries };
  }

  if (input.searchStatus === 'loading') {
    return { type: 'loading', tip: 'Searching...' };
  }

  if (input.searchStatus === 'not_found') {
    return {
      type: 'empty',
      description: input.searchError ?? 'No employee found with that ID.',
    };
  }

  if (input.searchStatus === 'error') {
    return {
      type: 'error',
      message: input.searchError ?? 'Something went wrong while searching.',
      retry: input.onRetrySearch,
    };
  }

  if (input.displayedEmployees.length === 0) {
    if (input.searchStatus !== 'idle') {
      return { type: 'empty', description: 'No employee found with that ID.' };
    }
    return { type: 'empty', description: 'No employees yet. Add one to get started.' };
  }

  return { type: 'ready', employees: input.displayedEmployees };
}
