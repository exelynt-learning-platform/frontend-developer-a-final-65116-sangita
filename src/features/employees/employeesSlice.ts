import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { employeesAPI } from './employeesAPI';
import { isNotFoundError, toRejectedPayload } from '../../api/client';
import { USER_MESSAGES } from '../../constants/messages';
import type { Employee, EmployeeFormValues, RejectedPayload, SearchStatus } from '../../types';

interface EmployeesState {
  list: Employee[];
  loading: boolean;
  error: string | null;
  // kept separate so a failed search doesn't clear the main table
  searchResult: Employee | null;
  searchStatus: SearchStatus;
  searchError: string | null;
  searchQuery: string;
  mutationLoading: boolean;
  mutationError: string | null;
}

const initialState: EmployeesState = {
  list: [],
  loading: false,
  error: null,
  searchResult: null,
  searchStatus: 'idle',
  searchError: null,
  searchQuery: '',
  mutationLoading: false,
  mutationError: null,
};

type ThunkApi = { rejectValue: RejectedPayload };

export const fetchEmployees = createAsyncThunk<Employee[], void, ThunkApi>(
  'employees/fetchAll',
  async (_: void, { rejectWithValue }) => {
    try {
      return await employeesAPI.getAll();
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

export const searchEmployeeById = createAsyncThunk<Employee, string, ThunkApi>(
  'employees/searchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await employeesAPI.getById(id);
    } catch (err) {
      // mockapi returns 404 for unknown ids — treat as "not found"
      if (isNotFoundError(err)) {
        return rejectWithValue({
          message: `No employee found with ID "${id}".`,
          notFound: true,
        });
      }
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

export const createEmployee = createAsyncThunk<Employee, EmployeeFormValues, ThunkApi>(
  'employees/create',
  async (payload: EmployeeFormValues, { rejectWithValue }) => {
    try {
      return await employeesAPI.create(payload);
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

export const updateEmployee = createAsyncThunk<
  Employee,
  { id: string; payload: EmployeeFormValues },
  ThunkApi
>('employees/update', async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await employeesAPI.update(id, payload);
  } catch (err) {
    return rejectWithValue(toRejectedPayload(err));
  }
});

export const deleteEmployee = createAsyncThunk<string, string, ThunkApi>(
  'employees/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      return await employeesAPI.remove(id);
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearSearch(state) {
      state.searchResult = null;
      state.searchStatus = 'idle';
      state.searchError = null;
      state.searchQuery = '';
    },
    clearMutationError(state) {
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action: PayloadAction<Employee[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? USER_MESSAGES.failedToLoadEmployees;
      })

      .addCase(searchEmployeeById.pending, (state, action) => {
        state.searchStatus = 'loading';
        state.searchError = null;
        state.searchResult = null;
        state.searchQuery = action.meta.arg;
      })
      .addCase(searchEmployeeById.fulfilled, (state, action: PayloadAction<Employee>) => {
        state.searchStatus = 'found';
        state.searchResult = action.payload;
      })
      .addCase(searchEmployeeById.rejected, (state, action) => {
        state.searchStatus = action.payload?.notFound ? 'not_found' : 'error';
        state.searchResult = null;
        state.searchError = action.payload?.message ?? USER_MESSAGES.employeeNotFound;
      })

      .addCase(createEmployee.pending, (state) => {
        state.mutationLoading = true;
        state.mutationError = null;
      })
      .addCase(createEmployee.fulfilled, (state, action: PayloadAction<Employee>) => {
        state.mutationLoading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.payload?.message ?? USER_MESSAGES.failedToCreate;
      })

      .addCase(updateEmployee.pending, (state) => {
        state.mutationLoading = true;
        state.mutationError = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action: PayloadAction<Employee>) => {
        state.mutationLoading = false;
        const idx = state.list.findIndex((e) => e.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.payload?.message ?? USER_MESSAGES.failedToUpdate;
      })

      .addCase(deleteEmployee.pending, (state) => {
        state.mutationLoading = true;
        state.mutationError = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action: PayloadAction<string>) => {
        state.mutationLoading = false;
        state.list = state.list.filter((e) => e.id !== action.payload);
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.payload?.message ?? USER_MESSAGES.failedToDelete;
      });
  },
});

export const { clearSearch, clearMutationError } = employeesSlice.actions;
export default employeesSlice.reducer;
