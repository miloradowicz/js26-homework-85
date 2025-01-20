import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api';
import { TrackSet } from '../../types';
import { enqueueSnackbar } from 'notistack';
import TrackList from '../../components/TrackList/TrackList';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../store/slices/usersSlice';
import { isAxiosError } from 'axios';

const TracksViewer = () => {
  const { id } = useParams();
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TrackSet>();

  const handlePlay = useCallback(
    async (id: string) => {
      try {
        await api.post<TrackSet>('track_history', { track: id }, { headers: { Authorization: user?.token } });
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: 'error' });
        } else {
          console.error(e);
        }
      }
    },
    [user]
  );

  const loadArtists = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get<TrackSet>('tracks', { params: { album: id } });

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
    loadArtists();
  }, [loadArtists]);

  return (
    <>
      <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Box sx={{ p: 2 }}>
        <Typography gutterBottom variant='h6' component='div'>
          {data?.album?.artist.name} - {data?.album?.title}
        </Typography>
        <TrackList list={data?.tracks ?? []} onPlay={handlePlay} />
      </Box>
    </>
  );
};

export default TracksViewer;
