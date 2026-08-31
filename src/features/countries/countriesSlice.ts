import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { countriesAPI } from './countriesAPI';
import { getErrorMessage } from '../../api/client';
import type { Country } from '../../types';

interface CountriesState {
  list: Country[];
  loading: boolean;
  error: string | null;
}

const initialState: CountriesState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchCountries = createAsyncThunk(
  'countries/fetchAll',
  async (_: void, { rejectWithValue }) => {
    try {
      return await countriesAPI.getAll();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action: PayloadAction<Country[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to load countries.';
      });
  },
});

export default countriesSlice.reducer;
