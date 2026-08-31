import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import countriesReducer, { fetchCountries } from '../features/countries/countriesSlice';
import { countriesAPI } from '../features/countries/countriesAPI';
import type { Country } from '../types';

vi.mock('../features/countries/countriesAPI');

const mockCountries: Country[] = [
  { id: '1', country: 'India' },
  { id: '2', country: 'Aruba' },
];

function setupStore() {
  return configureStore({ reducer: { countries: countriesReducer } });
}

describe('countriesSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('has the expected initial state', () => {
    const state = countriesReducer(undefined, { type: '@@init' });
    expect(state).toEqual({ list: [], loading: false, error: null });
  });

  it('sets loading true while fetchCountries is pending', async () => {
    vi.mocked(countriesAPI.getAll).mockResolvedValueOnce(mockCountries);
    const store = setupStore();

    const promise = store.dispatch(fetchCountries());
    expect(store.getState().countries.loading).toBe(true);

    await promise;
    expect(store.getState().countries.loading).toBe(false);
  });

  it('populates the list on success and clears any previous error', async () => {
    vi.mocked(countriesAPI.getAll).mockResolvedValueOnce(mockCountries);
    const store = setupStore();

    await store.dispatch(fetchCountries());

    const state = store.getState().countries;
    expect(state.list).toEqual(mockCountries);
    expect(state.error).toBeNull();
  });

  it('sets an error message and leaves the list untouched on failure', async () => {
    vi.mocked(countriesAPI.getAll).mockRejectedValueOnce(new Error('Network down'));
    const store = setupStore();

    await store.dispatch(fetchCountries());

    const state = store.getState().countries;
    expect(state.loading).toBe(false);
    expect(state.error).toContain('Network down');
    expect(state.list).toEqual([]);
  });

  it('retrying after a failure clears the previous error', async () => {
    vi.mocked(countriesAPI.getAll).mockRejectedValueOnce(new Error('Network down'));
    const store = setupStore();
    await store.dispatch(fetchCountries());
    expect(store.getState().countries.error).not.toBeNull();

    vi.mocked(countriesAPI.getAll).mockResolvedValueOnce(mockCountries);
    await store.dispatch(fetchCountries());

    const state = store.getState().countries;
    expect(state.error).toBeNull();
    expect(state.list).toEqual(mockCountries);
  });
});
