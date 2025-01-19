import { Box, Grid2 as Grid, TextField, Typography } from '@mui/material';
import { ChangeEventHandler, FC, FormEventHandler, useEffect, useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectLoading, selectLoginError, selectRegistrationError } from '../../../store/slices/usersSlice';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';

interface Props {
  text: string;
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

const UserForm: FC<Props> = ({ text, onSubmit }) => {
  const loading = useAppSelector(selectLoading);
  const loginError = useAppSelector(selectLoginError);
  const registrationError = useAppSelector(selectRegistrationError);

  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<FormData>(initialData);

  useEffect(() => {
    if (loginError) {
      enqueueSnackbar(loginError.error, { variant: 'error' });
    }
  }, [enqueueSnackbar, loginError]);

  const getFieldError = (fieldName: string) => {
    try {
      return registrationError?.errors[fieldName].message;
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
    setData(initialData);
  };

  return (
    <>
      <Typography component='h1' variant='h5'>
        {text}
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
        <LoadingButton type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }} loading={loading}>
          {text}
        </LoadingButton>
      </Box>
    </>
  );
};

export default UserForm;
