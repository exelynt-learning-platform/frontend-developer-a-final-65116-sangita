import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { employeesAPI } from './employeesAPI';
import { getErrorMessage, isNotFoundError } from '../../api/client';
import type { Employee, EmployeeFormValues } from '../../types';

interface EmployeesState {
  list: Employee[];
  loading: boolean;
  error: string | null;
  // kept separate so a failed search doesn't clear the main table
  searchResult: Employee | null;
  searchStatus: 'idle' | 'loading' | 'found' | 'not_found' | 'error';
  searchError: string | null;
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
  mutationLoading: false,
  mutationError: null,
};

export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async (_: void, { rejectWithValue }) => {
    try {
      return await employeesAPI.getAll();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const searchEmployeeById = createAsyncThunk(
  'employees/searchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await employeesAPI.getById(id);
    } catch (err) {
      // mockapi returns 404 for unknown ids — treat as "not found"
      if (isNotFoundError(err)) {
        return rejectWithValue({ message: `No employee found with ID "${id}".`, notFound: true });
      }
      return rejectWithValue({ message: getErrorMessage(err), notFound: false });
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employees/create',
  async (payload: EmployeeFormValues, { rejectWithValue }) => {
    try {
      return await employeesAPI.create(payload);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, payload }: { id: string; payload: EmployeeFormValues }, { rejectWithValue }) => {
    try {
      return await employeesAPI.update(id, payload);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      return await employeesAPI.remove(id);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
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
        state.error = (action.payload as string) ?? 'Failed to load employees.';
      })

      .addCase(searchEmployeeById.pending, (state) => {
        state.searchStatus = 'loading';
        state.searchError = null;
        state.searchResult = null;
      })
      .addCase(searchEmployeeById.fulfilled, (state, action: PayloadAction<Employee>) => {
        state.searchStatus = 'found';
        state.searchResult = action.payload;
      })
      .addCase(searchEmployeeById.rejected, (state, action) => {
        const payload = action.payload as { message: string; notFound: boolean } | undefined;
        state.searchStatus = payload?.notFound ? 'not_found' : 'error';
        state.searchResult = null;
        state.searchError = payload?.message ?? 'Employee not found.';
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
        state.mutationError = (action.payload as string) ?? 'Failed to create employee.';
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
        state.mutationError = (action.payload as string) ?? 'Failed to update employee.';
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
        state.mutationError = (action.payload as string) ?? 'Failed to delete employee.';
      });
  },
});

export const { clearSearch, clearMutationError } = employeesSlice.actions;
export default employeesSlice.reducer;
