import { Box, Button, Card, CardContent, Link, Stack, Typography } from '@mui/material';
import { FC, memo, useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../store/slices/usersSlice';
import YouTubeIcon from '@mui/icons-material/YouTube';

interface Props {
  id: string;
  title: string;
  trackNum: number;
  length: string | null;
  youTubeUrl: string | null;
  onPlay: () => Promise<void>;
}

const TrackListItem: FC<Props> = ({ title, trackNum, length, youTubeUrl, onPlay }) => {
  const [loading, setLoading] = useState(false);
  const user = useAppSelector(selectUser);

  const handlePlay = async () => {
    try {
      setLoading(true);
      await onPlay();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant='outlined' sx={{ display: 'flex' }}>
      <Box display='flex' justifyContent='space-between' flex={1} alignItems='center'>
        <Stack flex={1}>
          <CardContent>
            <Typography gutterBottom variant='h6' component='div'>
              {trackNum}
            </Typography>
            <Typography gutterBottom variant='h6' component='div'>
              {title}
            </Typography>
            <Typography gutterBottom variant='h6' component='div'>
              {length}
            </Typography>
          </CardContent>
        </Stack>
        {user ? (
          <Stack alignItems='center'>
            {youTubeUrl ? (
              <Button href={youTubeUrl ?? '#'} loading={loading} onClick={handlePlay} target='_blank' endIcon={<YouTubeIcon />}>
                Play
              </Button>
            ) : (
              <Button loading={loading} onClick={handlePlay}>
                Play
              </Button>
            )}
          </Stack>
        ) : null}
      </Box>
    </Card>
  );
};

export default memo(TrackListItem, (prev, next) => prev.id === next.id);
