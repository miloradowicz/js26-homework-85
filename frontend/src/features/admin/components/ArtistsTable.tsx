import { useState, useCallback, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

import { PopulatedArtist } from '../../../types';
import { api } from '../../../api';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';
import Loader from '../../../components/UI/Loader/Loader';
import ArtistTableRow from './ArtistTableRow';

const ArtistsTable = () => {
  const user = useAppSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PopulatedArtist[]>([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get<PopulatedArtist[]>('admin/artists');

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
              <ArtistTableRow
                _id={x._id}
                name={x.name}
                photoUrl={x.photoUrl}
                description={x.description}
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

export default ArtistsTable;
