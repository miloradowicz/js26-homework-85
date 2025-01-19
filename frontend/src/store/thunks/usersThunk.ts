import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '../../api';
import { AuthenticationError, Session, User, SignInMutation, SignUpMutation, ValidationError } from '../../types';
import { isAxiosError } from 'axios';
import { RootState } from '../../app/store';

export const login = createAsyncThunk<Session, SignInMutation, { rejectValue: AuthenticationError }>('users/login', async (mutation, { rejectWithValue }) => {
  try {
    const { data } = await api.post<Session>('users/sessions', mutation);

    return data;
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 401) {
      return rejectWithValue(e.response.data);
    }

    throw e;
  }
});

export const register = createAsyncThunk<User, SignUpMutation, { rejectValue: ValidationError }>('users/register', async (mutation, { rejectWithValue }) => {
  try {
    const { data } = await api.post<User>('users', mutation);

    return data;
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data);
    }

    throw e;
  }
});

export const logout = createAsyncThunk<void, void, { state: RootState }>('users/logout', async (_, { getState }) => {
  const token = getState().users.user.token;

  await api.delete('users/sessions', { headers: { Authorization: token } });
});
