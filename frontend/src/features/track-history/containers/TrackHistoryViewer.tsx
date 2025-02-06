import { isAxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

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
        return void navigate('/login');
      } else if (isAxiosError(e) && e.response?.data.error) {
        return void enqueueSnackbar(`${e.message}: ${e.response.data.error}`, { variant: 'error' });
      } else if (e instanceof Error) {
        return void enqueueSnackbar(e.message, { variant: 'error' });
      }

      console.error(e);
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
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 'xs' }} size='small' aria-label='Artists'>
            <TableHead>
              <TableRow>
                <TableCell>Artist</TableCell>
                <TableCell>Track</TableCell>
                <TableCell align='right'>Last listened on</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((x) => (
                <TrackHistoryListItem
                  key={x._id}
                  id={x._id}
                  track={x.track.title}
                  artist={x.artist.name}
                  date={x.date}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default TrackHistoryViewer;
