import { Card, CardContent, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { FC, memo } from 'react';

interface Props {
  id: string;
  track: string;
  artist: string;
  date: string;
}

const TrackHistoryListItem: FC<Props> = ({ track, artist, date }) => {
  return (
    <Card variant='outlined' sx={{ display: 'flex' }}>
      <Stack flex={1}>
        <CardContent>
          <Typography gutterBottom variant='h6' component='div'>
            {dayjs(date).format('LLL')}
          </Typography>{' '}
          <Typography gutterBottom variant='h6' component='div'>
            {artist} - {track}
          </Typography>
        </CardContent>
      </Stack>
    </Card>
  );
};

export default memo(TrackHistoryListItem, (prev, next) => prev.id === next.id);
