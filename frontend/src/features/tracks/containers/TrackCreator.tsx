import { isAxiosError } from 'axios';
import { ChangeEvent, FormEventHandler, useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Typography, Box, Grid2 as Grid, TextField, MenuItem, SelectChangeEvent, Button } from '@mui/material';
import { Create } from '@mui/icons-material';

import { AlbumSet, Artist, ValidationError } from '../../../types';
import { api } from '../../../api';
import SelectField from '../../../components/UI/SelectField/SelectField';

interface FormData {
  title: string;
  album: string;
  trackNum: string;
  length: string;
  youTubeUrl: string;
}

const initialData: FormData = {
  title: '',
  album: '',
  trackNum: '',
  length: '',
  youTubeUrl: '',
};

const TrackCreator = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState(initialData);
  const [selectedArtist, setSelectedArtist] = useState('');
  const [error, setError] = useState<ValidationError | null>(null);
  const [loading, setLoading] = useState(false);
  const [artists, setArtists] = useState<Artist[]>();
  const [albums, setAlbums] = useState<AlbumSet>();

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

  const handleChangeSelectedArtist = async (value: string) => {
    setSelectedArtist(value);

    try {
      const { data } = await api.get<AlbumSet>('/albums', { params: { artist: value } });

      setAlbums(data);
    } catch (e) {
      if (e instanceof Error) {
        return void enqueueSnackbar(e.message, { variant: 'error' });
      }

      console.error(e);
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

  const handleSubmit: FormEventHandler = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();

      try {
        await api.post('/tracks', data);
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
        Add track
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
          <Grid size={12}>
            <SelectField
              required
              fullWidth
              label='Artist'
              name='artist'
              value={selectedArtist}
              onChange={(e) => handleChangeSelectedArtist(e.target.value as string)}
            >
              {artists?.map((x) => (
                <MenuItem key={x._id} value={x._id}>
                  {x.name}
                </MenuItem>
              ))}
            </SelectField>
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <SelectField
              required
              fullWidth
              label='Album'
              name='album'
              value={data.album}
              onChange={handleChange}
              error={!!getFieldError('album')}
              helperText={getFieldError('album')}
            >
              {albums?.albums.map((x) => (
                <MenuItem key={x._id} value={x._id}>
                  {x.title}
                </MenuItem>
              )) ?? <MenuItem disabled>Select an album first</MenuItem>}
            </SelectField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              required
              fullWidth
              label='Track #'
              name='trackNum'
              type='number'
              value={data.trackNum}
              onChange={handleChange}
              error={!!getFieldError('trackNum')}
              helperText={getFieldError('trackNum')}
              slotProps={{
                htmlInput: {
                  min: 1,
                  max: 99,
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              fullWidth
              label='YouTube Url'
              name='youTubeUrl'
              type='url'
              value={data.youTubeUrl}
              onChange={handleChange}
              error={!!getFieldError('youTubeUrl')}
              helperText={getFieldError('youTubeUrl')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label='Length'
              name='length'
              value={data.length}
              onChange={handleChange}
              error={!!getFieldError('length')}
              helperText={getFieldError('length')}
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

export default TrackCreator;
