import { isAxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { Box, Stack, Typography } from '@mui/material';

import { TrackSet } from '../../../types';
import { api } from '../../../api';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';
import Loader from '../../../components/UI/Loader/Loader';
import TrackListItem from '../components/TrackListItem';

const TracksViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);
  const [data, setData] = useState<TrackSet>();
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get<TrackSet>('tracks', { params: { album: id } });

      setData(data);
    } catch (e) {
      if (isAxiosError(e) && (e.status === 404 || e.status === 400)) {
        const locationWithoutId = location.pathname.slice(0, location.pathname.lastIndexOf('/'));
        navigate(`${locationWithoutId}/not-found`);
      } else if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: 'error' });
      } else {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate, location]);

  useEffect(() => {
    load();
  }, [load, user]);

  const handlePlay = useCallback(async (id: string) => {
    try {
      await api.post<TrackSet>('track_history', { track: id });
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: 'error' });
      } else {
        console.error(e);
      }
    }
  }, []);

  const handlePublish = async (id: string) => {
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
      <Box maxWidth='md' mx='auto'>
        <Typography component='h1' variant='h4' gutterBottom>
          Tracks
        </Typography>
        <Stack gap={1} py={2}>
          {data?.tracks.length ? (
            data?.tracks?.map((x) => (
              <TrackListItem
                key={x._id}
                id={x._id}
                title={x.title}
                trackNum={x.trackNum}
                length={x.length}
                youTubeUrl={x.youTubeUrl}
                isPublished={x.isPublished}
                uploadedBy={x.uploadedBy}
                onPlay={user ? () => handlePlay(x._id) : undefined}
                onPublish={() => handlePublish(x._id)}
                onDelete={() => handleDelete(x._id)}
              />
            ))
          ) : (
            <Typography fontStyle='italic'>Nothing here yet.</Typography>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default TracksViewer;
