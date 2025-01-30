import { useState, useCallback, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

import { PopulatedTrack } from '../../../types';
import { api } from '../../../api';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';
import Loader from '../../../components/UI/Loader/Loader';
import TracksTableRow from './TracksTableRow';

const TracksTable = () => {
  const user = useAppSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PopulatedTrack[]>([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get<PopulatedTrack[]>('admin/tracks');

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
              <TableCell align='right'>Artist</TableCell>
              <TableCell align='right'>TrackNum</TableCell>
              <TableCell align='right'>Length</TableCell>
              <TableCell align='right'>YouTube url</TableCell>
              <TableCell align='right'>Published</TableCell>
              <TableCell align='right'>Uploaded By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((x) => (
              <TracksTableRow
                _id={x._id}
                title={x.title}
                album={x.album}
                artist={x.artist}
                trackNum={x.trackNum}
                length={x.length}
                youTubeUrl={x.youTubeUrl}
                isPublished={x.isPublished}
                uploadedBy={x.uploadedBy}
                onTogglePublished={() => handleTogglePublished(x._id)}
                onDelete={() => handleDelete(x._id)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TracksTable;
