import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useState, useCallback, useEffect } from 'react';
import { api } from '../../../api';
import { useAppSelector } from '../../../app/hooks';
import { Artist } from '../../../types';
import { selectUser } from '../../users/usersSlice';
import Loader from '../../../components/UI/Loader/Loader';

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

  const handlePublish = async (id: string) => {
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
              <TableCell>Dessert (100g serving)</TableCell>
              <TableCell align='right'>Calories</TableCell>
              <TableCell align='right'>Fat&nbsp;(g)</TableCell>
              <TableCell align='right'>Carbs&nbsp;(g)</TableCell>
              <TableCell align='right'>Protein&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component='th' scope='row'>
                  {row.name}
                </TableCell>
                <TableCell align='right'>{row.calories}</TableCell>
                <TableCell align='right'>{row.fat}</TableCell>
                <TableCell align='right'>{row.carbs}</TableCell>
                <TableCell align='right'>{row.protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ArtistsTable;
