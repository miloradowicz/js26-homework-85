import { isAxiosError } from 'axios';
import { ChangeEvent, ChangeEventHandler, FormEventHandler, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Typography, Box, Grid2 as Grid, TextField, SelectChangeEvent, Button } from '@mui/material';
import { AddAPhoto, Create } from '@mui/icons-material';

import { ValidationError } from '../../../types';
import { api } from '../../../api';
import FileInput from '../../../components/UI/FileInput/FileInput';

interface FormData {
  name: string;
  photo: File | '';
  description: string;
}

const initialData: FormData = {
  name: '',
  photo: '',
  description: '',
};

const ArtistCreator = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState(initialData);
  const [error, setError] = useState<ValidationError | null>(null);
  const [loading, setLoading] = useState(false);

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<unknown>) => {
    setError((error) => {
      let _error = error;

      if (error?.errors[e.target.name]) {
        _error = { ...error };
        delete _error.errors[e.target.name];
      }

      return _error;
    });

    setData((data) => ({ ...data, [e.target.name]: e.target.value }));
  };

  const handleFileInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setError((error) => {
      let _error = error;

      if (error?.errors[e.target.name]) {
        _error = { ...error };
        delete _error.errors[e.target.name];
      }

      return _error;
    });

    if (e.target.files) {
      const file = e.target.files[0];
      setData((data) => ({ ...data, [e.target.name]: file }));
    }
  };

  const handleSubmit: FormEventHandler = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();

      try {
        await api.post('/artists', data);
        setData(initialData);
      } catch (e) {
        if (isAxiosError(e) && e.response && e.response.status === 400) {
          setError(e.response.data);
        } else if (e instanceof Error) {
          return enqueueSnackbar(e.message, { variant: 'error' });
        }

        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth='sm' mx='auto'>
      <Typography component='h1' variant='h4' gutterBottom>
        Add artist
      </Typography>
      <Box
        noValidate
        component='form'
        onSubmit={handleSubmit}
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            '& .MuiGrid2-root': { minHeight: 80 },
          }}
        >
          <Grid size={12}>
            <TextField
              required
              fullWidth
              label='Name'
              name='name'
              value={data.name}
              onChange={handleChange}
              error={!!getFieldError('name')}
              helperText={getFieldError('name')}
            />
          </Grid>
          <Grid size={12}>
            <FileInput
              fullWidth
              label='Photo'
              name='photo'
              buttonText='Upload'
              buttonProps={{
                disableElevation: true,
                variant: 'contained',
                startIcon: <AddAPhoto />,
                sx: { px: 5 },
              }}
              value={data.photo}
              onChange={handleFileInputChange}
              error={!!getFieldError('photo')}
              helperText={getFieldError('photo')}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              required
              fullWidth
              multiline
              minRows={4}
              label='Description'
              name='description'
              value={data.description}
              onChange={handleChange}
              error={!!getFieldError('description')}
              helperText={getFieldError('description')}
            />
          </Grid>

          <Grid size={12}>
            <Button fullWidth type='submit' loading={loading} startIcon={<Create />} sx={{ p: 3 }}>
              Add
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ArtistCreator;
