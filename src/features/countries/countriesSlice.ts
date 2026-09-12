import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { countriesAPI } from './countriesAPI';
import { toRejectedPayload } from '../../api/client';
import type { Country, RejectedPayload } from '../../types';

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

type ThunkApi = { rejectValue: RejectedPayload };

export const fetchCountries = createAsyncThunk<Country[], void, ThunkApi>(
  'countries/fetchAll',
  async (_: void, { rejectWithValue }) => {
    try {
      return await countriesAPI.getAll();
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
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
        state.error = action.payload?.message ?? 'Failed to load countries.';
      });
  },
});

export default countriesSlice.reducer;
