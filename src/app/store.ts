import { configureStore } from '@reduxjs/toolkit';
import employeesReducer from '../features/employees/employeesSlice';
import countriesReducer from '../features/countries/countriesSlice';

export const store = configureStore({
  reducer: {
    employees: employeesReducer,
    countries: countriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
