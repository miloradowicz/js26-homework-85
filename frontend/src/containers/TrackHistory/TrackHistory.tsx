import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../store/slices/usersSlice';
import { useNavigate } from 'react-router-dom';
import { Backdrop, CircularProgress, Box, Typography } from '@mui/material';
import { api } from '../../api';
import { TrackHistoryRecord } from '../../types';
import { useSnackbar } from 'notistack';
import TrackHistoryList from '../../components/TrackHistoryList/TrackHistoryList';

const TrackHistory = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TrackHistoryRecord[]>([]);
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get<TrackHistoryRecord[]>('track_history', { headers: { Authorization: user?.token } });

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
  }, [user, enqueueSnackbar]);

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
        <TrackHistoryList list={data} />
      </Box>
    </>
  );
};

export default TrackHistory;
