import { isAxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AuthenticationError, Session, User, SignInMutation, SignUpMutation, ValidationError } from '../../types';
import { api } from '../../api';

export const login = createAsyncThunk<Session, SignInMutation, { rejectValue: AuthenticationError }>(
  'users/login',
  async (mutation, { rejectWithValue }) => {
    try {
      const { data } = await api.post<Session>('users/sessions', mutation);

      return data;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 401) {
        return rejectWithValue(e.response.data);
      }

      throw e;
    }
  }
);

export const register = createAsyncThunk<User, SignUpMutation, { rejectValue: ValidationError }>(
  'users/register',
  async (mutation, { rejectWithValue }) => {
    try {
      const { data } = await api.post<User>('users', mutation);

      return data;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data);
      }

      throw e;
    }
  }
);

export const logout = createAsyncThunk('users/logout', async () => {
  const { data } = await api.delete<Session>('users/sessions');

  return data;
});
