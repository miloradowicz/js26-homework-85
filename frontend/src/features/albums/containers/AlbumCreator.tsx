import { isAxiosError } from 'axios';
import { ChangeEvent, ChangeEventHandler, FormEventHandler, useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Typography, Box, Grid2 as Grid, TextField, MenuItem, SelectChangeEvent, Button } from '@mui/material';
import { AddAPhoto, Create } from '@mui/icons-material';

import { Artist, ValidationError } from '../../../types';
import { api } from '../../../api';
import SelectField from '../../../components/UI/SelectField/SelectField';
import FileInput from '../../../components/UI/FileInput/FileInput';

interface FormData {
  title: string;
  artist: string;
  year: string;
  cover: File | '';
}

const initialData: FormData = {
  title: '',
  artist: '',
  year: '',
  cover: '',
};

const AlbumCreator = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState(initialData);
  const [error, setError] = useState<ValidationError | null>(null);
  const [loading, setLoading] = useState(false);
  const [artists, setArtists] = useState<Artist[]>();

  const load = useCallback(async () => {
    try {
      const { data } = await api.get<Artist[]>('/artists');

      setArtists(data);
    } catch (e) {
      if (e instanceof Error) {
        return void enqueueSnackbar(e.message, { variant: 'error' });
      }

      console.error(e);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    load();
  }, [load]);

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
        await api.post('/albums', data);
        setData(initialData);
      } catch (e) {
        if (isAxiosError(e) && e.response && e.response.status === 400) {
          setError(e.response.data);
        } else if (e instanceof Error) {
          return void enqueueSnackbar(e.message, { variant: 'error' });
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
        Add album
      </Typography>
      <Box
        py={2}
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
              label='Title'
              name='title'
              value={data.title}
              onChange={handleChange}
              error={!!getFieldError('title')}
              helperText={getFieldError('title')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <SelectField
              required
              fullWidth
              label='Artist'
              name='artist'
              value={data.artist}
              onChange={handleChange}
              error={!!getFieldError('artist')}
              helperText={getFieldError('artist')}
            >
              {artists?.map((x) => (
                <MenuItem key={x._id} value={x._id}>
                  {x.name}
                </MenuItem>
              ))}
            </SelectField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              required
              fullWidth
              label='Year'
              name='year'
              type='number'
              value={data.year}
              onChange={handleChange}
              error={!!getFieldError('year')}
              helperText={getFieldError('year')}
              slotProps={{
                htmlInput: {
                  min: 1900,
                  max: 2032,
                },
              }}
            />
          </Grid>
          <Grid size={12}>
            <FileInput
              fullWidth
              label='Cover'
              name='cover'
              buttonText='Upload'
              buttonProps={{
                disableElevation: true,
                variant: 'contained',
                startIcon: <AddAPhoto />,
                sx: { px: 5 },
              }}
              value={data.cover}
              onChange={handleFileInputChange}
              error={!!getFieldError('cover')}
              helperText={getFieldError('cover')}
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

export default AlbumCreator;
