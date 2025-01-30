import { useCallback, useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { Box, Grid2 as Grid, Typography } from '@mui/material';

import { Artist } from '../../../types';
import { api } from '../../../api';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';
import Loader from '../../../components/UI/Loader/Loader';
import ArtistListItem from '../components/ArtistListItem';

const ArtistsViewer = () => {
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
      <Box maxWidth='md' mx='auto'>
        <Typography component='h1' variant='h4' gutterBottom>
          Artists
        </Typography>
        <Box py={2}>
          {data.length ? (
            <Grid container spacing={1} justifyContent={{ sx: 'center' }}>
              {data.map((x) => (
                <Grid key={x._id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <ArtistListItem
                    id={x._id}
                    name={x.name}
                    photoUrl={x.photoUrl}
                    description={x.description}
                    isPublished={x.isPublished}
                    uploadedBy={x.uploadedBy}
                    onPublish={() => handlePublish(x._id)}
                    onDelete={() => handleDelete(x._id)}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography fontStyle='italic'>Nothing here yet.</Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default ArtistsViewer;
