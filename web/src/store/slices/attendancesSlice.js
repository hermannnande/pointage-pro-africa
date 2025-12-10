import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  attendances: [],
  stats: null,
  loading: false,
  error: null,
};

const attendancesSlice = createSlice({
  name: 'attendances',
  initialState,
  reducers: {
    fetchAttendancesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAttendancesSuccess: (state, action) => {
      state.loading = false;
      state.attendances = action.payload.attendances;
      state.stats = action.payload.stats;
    },
    fetchAttendancesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchAttendancesStart,
  fetchAttendancesSuccess,
  fetchAttendancesFailure,
} = attendancesSlice.actions;

export default attendancesSlice.reducer;

