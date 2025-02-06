import { FC, memo, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Grid2 as Grid,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Delete, YouTube, Publish } from '@mui/icons-material';

import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';

interface Props {
  id: string;
  title: string;
  trackNum: number;
  length: string | null;
  youTubeUrl: string | null;
  isPublished: boolean;
  uploadedBy: string;
  onPlay?: () => Promise<void>;
  onPublish: () => Promise<void>;
  onDelete: () => Promise<void>;
}

const TrackListItem: FC<Props> = ({
  title,
  trackNum,
  length,
  youTubeUrl,
  isPublished,
  uploadedBy,
  onPlay,
  onPublish,
  onDelete,
}) => {
  const user = useAppSelector(selectUser);
  const [playing, setPlaying] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handlePlay = async () => {
    if (onPlay) {
      try {
        setPlaying(true);
        await onPlay();
      } finally {
        setPlaying(false);
      }
    }
  };

  const handlePublish = async () => {
    try {
      setPublishing(true);

      await onPublish();
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);

      await onDelete();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card variant='outlined'>
      <CardContent component={Grid} container sx={{ py: 1, px: 4 }}>
        <Grid size={{ xs: 2 }}>
          <Typography gutterBottom variant='body1' component='div'>
            {trackNum}
          </Typography>
        </Grid>
        <Grid size={{ xs: 8 }}>
          <Typography gutterBottom variant='body1' component='div'>
            {title}
          </Typography>
        </Grid>
        <Grid size={{ xs: 2 }}>
          <Stack justifyContent='center'>
            <Typography gutterBottom variant='body1' component='div' textAlign='center'>
              {length}
            </Typography>
            {onPlay && youTubeUrl ? (
              <Button
                href={youTubeUrl ?? '#'}
                loading={playing}
                onClick={handlePlay}
                target='_blank'
                endIcon={<YouTube />}
              >
                Play
              </Button>
            ) : (
              <Button loading={playing} onClick={handlePlay}>
                Play
              </Button>
            )}
          </Stack>
        </Grid>
      </CardContent>
      <CardActions>
        {!isPublished && (
          <Chip
            label='Unpublished'
            variant='outlined'
            deleteIcon={
              <Tooltip title='Publish' placement='right'>
                {publishing ? <CircularProgress size={18} /> : <Publish />}
              </Tooltip>
            }
            onDelete={user && user.role === 'admin' ? handlePublish : undefined}
          />
        )}
        {user && (user.role === 'admin' || (!isPublished && uploadedBy === user._id)) && (
          <Chip
            label='Uploaded'
            variant='outlined'
            deleteIcon={
              <Tooltip title='Delete' placement='right'>
                {deleting ? <CircularProgress size={18} /> : <Delete />}
              </Tooltip>
            }
            onDelete={handleDelete}
          />
        )}
      </CardActions>
    </Card>
  );
};

export default memo(TrackListItem, (prev, next) => prev.id === next.id && prev.isPublished === next.isPublished);
