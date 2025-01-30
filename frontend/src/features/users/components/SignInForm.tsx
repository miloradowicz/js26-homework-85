import { ChangeEventHandler, FC, FormEventHandler, useState } from 'react';
import { Box, Button, Grid2 as Grid, TextField, Typography } from '@mui/material';

import { AuthenticationError } from '../../../types';
import { useAppSelector } from '../../../app/hooks';
import { selectError, selectLoading } from '../usersSlice';

interface Props {
  onSubmit: (data: FormData) => Promise<void>;
}

interface FormData {
  username: string;
  password: string;
}

const initialData: FormData = {
  username: '',
  password: '',
};

const SignInForm: FC<Props> = ({ onSubmit }) => {
  const [data, setData] = useState<FormData>(initialData);
  const error = useAppSelector(selectError);
  const loading = useAppSelector(selectLoading);

  const getFieldError = (fieldName: string) => {
    try {
      return (error as AuthenticationError)?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    setData((data) => ({ ...data, [e.target.name]: e.target.value }));
  };

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    await onSubmit(data);
    setData((data) => ({ ...data, password: '' }));
  };

  return (
    <>
      <Typography component='h1' variant='h5'>
        Sign In
      </Typography>
      <Box component='form' noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              required
              fullWidth
              label='Username'
              name='username'
              autoComplete='username'
              value={data.username}
              onChange={handleChange}
              error={!!getFieldError('username')}
              helperText={getFieldError('username')}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              required
              fullWidth
              label='Password'
              name='password'
              type='password'
              autoComplete='new-password'
              value={data.password}
              onChange={handleChange}
              error={!!getFieldError('password')}
              helperText={getFieldError('password')}
            />
          </Grid>
        </Grid>
        <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }} loading={loading}>
          Sign In
        </Button>
      </Box>
    </>
  );
};

export default SignInForm;
