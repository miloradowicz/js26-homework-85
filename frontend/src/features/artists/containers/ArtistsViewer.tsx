import { useCallback, useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';

import { Artist } from '../../../types';
import { api } from '../../../api';
import ArtistList from '../components/ArtistList';

const ArtistsViewer = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Artist[]>([]);

  const loadArtists = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get<Artist[]>('artists');

      setData(data);
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: 'error' });
      } else {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArtists();
  }, [loadArtists]);

  return (
    <>
      <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Typography gutterBottom variant='h6' component='div'>
        Artists
      </Typography>
      <Box sx={{ p: 2 }}>{data.length ? <ArtistList list={data} /> : <Typography>Nothing here yet.</Typography>}</Box>
    </>
  );
};

export default ArtistsViewer;
