import { useState, useCallback, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

import { PopulatedAlbum } from '../../../types';
import { api } from '../../../api';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';
import Loader from '../../../components/UI/Loader/Loader';
import AlbumsTableRow from './AlbumsTableRow';

const AlbumsTable = () => {
  const user = useAppSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PopulatedAlbum[]>([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get<PopulatedAlbum[]>('admin/albums');

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
      await api.patch(`/albums/${id}/togglePublished`);

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
      await api.delete(`/albums/${id}`);

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
              <TableCell align='right'>Artist</TableCell>
              <TableCell align='right'>Year</TableCell>
              <TableCell align='right'>Cover url</TableCell>
              <TableCell align='right'>Track count</TableCell>
              <TableCell align='right'>Published</TableCell>
              <TableCell align='right'>Uploaded by</TableCell>
              <TableCell align='right'>Controls</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((x) => (
              <AlbumsTableRow
                _id={x._id}
                title={x.title}
                artist={x.artist}
                year={x.year}
                coverUrl={x.coverUrl}
                trackCount={x.trackCount}
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

export default AlbumsTable;
