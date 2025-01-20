import { Backdrop, Box, CircularProgress } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api';
import { Artist } from '../../types';
import { enqueueSnackbar } from 'notistack';
import ArtistList from '../../components/ArtistList/ArtistList';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

const ArtistsViewer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Artist[]>([]);

  const loadArtists = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get<Artist[]>('artists');

      setData(data);
    } catch (e) {
      if (isAxiosError(e) && e.status === 404) {
        navigate('not-found');
      } else if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: 'error' });
      } else {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadArtists();
  }, [loadArtists]);

  return (
    <>
      <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Box sx={{ p: 2 }}>
        <ArtistList list={data} />
      </Box>
    </>
  );
};

export default ArtistsViewer;
