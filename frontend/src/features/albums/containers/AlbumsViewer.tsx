import { isAxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';

import { AlbumSet } from '../../../types';
import { api } from '../../../api';
import AlbumList from '../components/AlbumList';

const ArtistViewer = () => {
  const { id } = useParams();
  const location = useLocation();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AlbumSet>();

  const loadAlbums = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get<AlbumSet>('albums', { params: { artist: id } });

      setData(data);
    } catch (e) {
      if (isAxiosError(e) && (e.status === 404 || e.status === 400)) {
        const locationWithoutId = location.pathname.slice(0, location.pathname.lastIndexOf('/'));
        navigate(`${locationWithoutId}/not-found`);
      } else if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: 'error' });
      } else {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate, location]);

  useEffect(() => {
    loadAlbums();
  }, [loadAlbums]);

  return (
    <>
      <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Box sx={{ p: 2 }}>
        <Typography gutterBottom variant='h6' component='div'>
          {data?.artist?.name}
        </Typography>

        <Box sx={{ p: 2 }}>
          {data?.albums.length ? <AlbumList list={data?.albums ?? []} /> : <Typography>Nothing here yet.</Typography>}
        </Box>
      </Box>
    </>
  );
};

export default ArtistViewer;
