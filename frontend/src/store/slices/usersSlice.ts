import { createSlice } from '@reduxjs/toolkit';
import { login, logout, register } from '../thunks/usersThunk';
import { AuthenticationError, User, ValidationError } from '../../types';
import { RootState } from '../../app/store';

interface State {
  user: User | null;
  loading: boolean;
  loginError: AuthenticationError | null;
  registrationError: ValidationError | null;
}

const initialState: State = {
  user: null,
  loading: false,
  loginError: null,
  registrationError: null,
};

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.loginError = null;
        state.registrationError = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
      })
      .addCase(login.rejected, (state, { payload: error }) => {
        state.loading = false;
        state.loginError = error ?? null;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.loginError = null;
        state.registrationError = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
      })
      .addCase(register.rejected, (state, { payload: error }) => {
        state.loading = false;
        state.registrationError = error ?? null;
      })
      .addCase(logout.pending, (state) => {
        state.user = null;
      });
  },
});

export const users = slice.reducer;

export const selectUser = (state: RootState) => state.users.user;
export const selectLoading = (state: RootState) => state.users.loading;
export const selectLoginError = (state: RootState) => state.users.loginError;
export const selectRegistrationError = (state: RootState) => state.users.registrationError;
