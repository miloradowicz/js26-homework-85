import { isAxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Box, Stack, Typography } from '@mui/material';

import { TrackHistoryRecord } from '../../../types';
import { api } from '../../../api';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';
import Loader from '../../../components/UI/Loader/Loader';
import TrackHistoryListItem from '../components/TrackHistoryListItem';

const TrackHistoryViewer = () => {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const user = useAppSelector(selectUser);
  const [data, setData] = useState<TrackHistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get<TrackHistoryRecord[]>('track_history');

      setData(data);
    } catch (e) {
      if (isAxiosError(e) && e.status === 401) {
        navigate('/login');
      } else if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: 'error' });
      } else {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, navigate]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory, user]);

  return (
    <>
      <Loader open={loading} />
      <Box maxWidth='md' mx='auto'>
        <Typography component='h1' variant='h4' gutterBottom>
          Track history
        </Typography>
        <Stack gap={1} py={2}>
          {data.length ? (
            data.map((x) => (
              <TrackHistoryListItem key={x._id} id={x._id} track={x.track.title} artist={x.artist.name} date={x.date} />
            ))
          ) : (
            <Typography fontStyle='italic'>Nothing here yet.</Typography>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default TrackHistoryViewer;
