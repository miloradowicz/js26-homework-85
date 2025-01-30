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
import { AlbumSet } from '../../../types';
import { selectUser } from '../../users/usersSlice';
import Loader from '../../../components/UI/Loader/Loader';
import { CheckCircle, CheckCircleOutline, Delete, Public, PublicOff } from '@mui/icons-material';

const AlbumsTable = () => {
  const user = useAppSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AlbumSet>();

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get<AlbumSet>('albums');

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
            {data?.albums.map((x) => (
              <TableRow key={x._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component='th' scope='row'>
                  {x._id}
                </TableCell>
                <TableCell align='right'>{x.title}</TableCell>
                <TableCell align='right'>{x.artist}</TableCell>
                <TableCell align='right'>{x.year}</TableCell>
                <TableCell align='right'>{x.coverUrl}</TableCell>
                <TableCell align='right'>{x.trackCount}</TableCell>
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

export default AlbumsTable;
