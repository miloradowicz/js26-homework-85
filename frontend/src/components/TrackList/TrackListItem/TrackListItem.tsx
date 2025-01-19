import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { FC, memo } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../store/slices/usersSlice';

interface Props {
  id: string;
  title: string;
  trackNum: number;
  length: string | null;
  onPlay: () => Promise<void>;
}

const TrackListItem: FC<Props> = ({ title, trackNum, length, onPlay }) => {
  const user = useAppSelector(selectUser);

  return (
    <Card variant='outlined' sx={{ display: 'flex' }}>
      <Box display='flex' justifyContent='space-between' flex={1}>
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
        {user ? <Button onClick={onPlay}>Play</Button> : null}
      </Box>
    </Card>
  );
};

export default memo(TrackListItem, (prev, next) => prev.id === next.id);
