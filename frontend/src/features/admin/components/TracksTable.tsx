import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useState, useCallback, useEffect } from 'react';
import { api } from '../../../api';
import { useAppSelector } from '../../../app/hooks';
import { TrackSet } from '../../../types';
import { selectUser } from '../../users/usersSlice';
import Loader from '../../../components/UI/Loader/Loader';
import { CheckCircle, CheckCircleOutline, Delete, Public, PublicOff } from '@mui/icons-material';

const TracksTable = () => {
  const user = useAppSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TrackSet>();

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get<TrackSet>('tracks');

      setData(data);
    } catch (e) {
      if (e instanceof Error) {
        return enqueueSnackbar(e.message, { variant: 'error' });
      }

      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, user]);

  const handleTogglePublished = async (id: string) => {
    try {
      await api.patch(`/tracks/${id}/togglePublished`);

      load();
    } catch (e) {
      if (e instanceof Error) {
        return void enqueueSnackbar(e.message, { variant: 'error' });
      }

      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/tracks/${id}`);

      load();
    } catch (e) {
      if (e instanceof Error) {
        return void enqueueSnackbar(e.message, { variant: 'error' });
      }

      console.error(e);
    }
  };

  return (
    <>
      <Loader open={loading} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 'xs' }} size='small' aria-label='Artists'>
          <TableHead>
            <TableRow>
              <TableCell align='right'>Id</TableCell>
              <TableCell align='right'>Title</TableCell>
              <TableCell align='right'>Album</TableCell>
              <TableCell align='right'>TrackNum</TableCell>
              <TableCell align='right'>Length</TableCell>
              <TableCell align='right'>YouTube url</TableCell>
              <TableCell align='right'>Published</TableCell>
              <TableCell align='right'>Uploaded By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.tracks.map((x) => (
              <TableRow key={x._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component='th' scope='row'>
                  {x._id}
                </TableCell>
                <TableCell align='right'>{x.title}</TableCell>
                <TableCell align='right'>{x.album}</TableCell>
                <TableCell align='right'>{x.trackNum}</TableCell>
                <TableCell align='right'>{x.length}</TableCell>
                <TableCell align='right'>{x.youTubeUrl}</TableCell>
                <TableCell align='right'>
                  <Tooltip title={x.isPublished ? 'Published' : 'Unpublished'}>
                    {x.isPublished ? <CheckCircle /> : <CheckCircleOutline />}
                  </Tooltip>
                </TableCell>
                <TableCell align='right'>{x.uploadedBy}</TableCell>
                <TableCell align='right'>
                  {
                    <Tooltip title={x.isPublished ? 'Unpublish' : 'Publish'} placement='left'>
                      <IconButton onClick={() => handleTogglePublished(x._id)}>
                        {x.isPublished ? <PublicOff /> : <Public />}
                      </IconButton>
                    </Tooltip>
                  }
                  <Tooltip title='Delete' placement='left'>
                    <IconButton onClick={() => handleDelete(x._id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TracksTable;
