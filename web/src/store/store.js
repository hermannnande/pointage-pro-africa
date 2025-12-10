import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import employeesReducer from './slices/employeesSlice';
import attendancesReducer from './slices/attendancesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeesReducer,
    attendances: attendancesReducer,
  },
});

export default store;

