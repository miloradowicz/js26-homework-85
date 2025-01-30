import { isAxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { Box, Grid2 as Grid, Typography } from '@mui/material';

import { AlbumSet } from '../../../types';
import { api } from '../../../api';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';
import Loader from '../../../components/UI/Loader/Loader';
import AlbumListItem from '../components/AlbumListItem';

const ArtistViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);
  const [data, setData] = useState<AlbumSet>();
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get<AlbumSet>('albums', { params: { artist: id } });

      setData(data);
    } catch (e) {
      if (isAxiosError(e) && (e.status === 404 || e.status === 400)) {
        const locationWithoutId = location.pathname.slice(0, location.pathname.lastIndexOf('/'));
        return navigate(`${locationWithoutId}/not-found`);
      } else if (e instanceof Error) {
        return enqueueSnackbar(e.message, { variant: 'error' });
      }

      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id, navigate, location]);

  useEffect(() => {
    load();
  }, [load, user]);

  const handlePublish = async (id: string) => {
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
      <Box maxWidth='md' mx='auto'>
        <Typography component='h1' variant='h4' gutterBottom>
          Albums
        </Typography>
        <Box py={2}>
          {data?.albums.length ? (
            <Grid container spacing={1} justifyContent={{ sx: 'center' }}>
              {data.albums.map((x) => (
                <Grid key={x._id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <AlbumListItem
                    key={x._id}
                    id={x._id}
                    title={x.title}
                    year={x.year}
                    coverUrl={x.coverUrl}
                    trackCount={x.trackCount}
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

export default ArtistViewer;
