import { isAxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Backdrop, CircularProgress, Box, Typography } from '@mui/material';

import { TrackHistoryRecord } from '../../../types';
import { api } from '../../../api';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';
import TrackHistoryList from '../components/TrackHistoryList';

const TrackHistoryViewer = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TrackHistoryRecord[]>([]);
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const { enqueueSnackbar } = useSnackbar();

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
  }, [loadHistory]);

  return (
    <>
      <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Box sx={{ p: 2 }}>
        {user && (
          <Typography gutterBottom variant='h6' component='div'>
            Track History
          </Typography>
        )}
        {data.length ? <TrackHistoryList list={data} /> : <Typography>Nothing here yet.</Typography>}
      </Box>
    </>
  );
};

export default TrackHistoryViewer;
