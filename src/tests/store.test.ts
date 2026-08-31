import { describe, it, expect } from 'vitest';
import { store } from '../app/store';

describe('root store', () => {
  it('wires up the employees and countries reducers with the correct initial shape', () => {
    const state = store.getState();

    expect(state).toHaveProperty('employees');
    expect(state).toHaveProperty('countries');

    expect(state.employees).toMatchObject({
      list: [],
      loading: false,
      error: null,
      searchResult: null,
      searchStatus: 'idle',
      searchError: null,
      mutationLoading: false,
      mutationError: null,
    });

    expect(state.countries).toMatchObject({
      list: [],
      loading: false,
      error: null,
    });
  });
});
