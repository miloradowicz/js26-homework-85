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
import { Artist } from '../../../types';
import { selectUser } from '../../users/usersSlice';
import Loader from '../../../components/UI/Loader/Loader';
import { CheckCircle, CheckCircleOutline, Delete, Public, PublicOff } from '@mui/icons-material';

const ArtistsTable = () => {
  const user = useAppSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Artist[]>([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get<Artist[]>('artists');

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
      await api.patch(`/artists/${id}/togglePublished`);

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
      await api.delete(`/artists/${id}`);

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
              <TableCell align='right'>Name</TableCell>
              <TableCell align='right'>Photo url</TableCell>
              <TableCell align='right'>Description</TableCell>
              <TableCell align='right'>Published</TableCell>
              <TableCell align='right'>Uploaded by</TableCell>
              <TableCell align='right'>Controls</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((x) => (
              <TableRow key={x._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component='th' scope='row'>
                  {x._id}
                </TableCell>
                <TableCell align='right'>{x.name}</TableCell>
                <TableCell align='right'>{x.photoUrl}</TableCell>
                <TableCell align='right'>{x.description}</TableCell>
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

export default ArtistsTable;
