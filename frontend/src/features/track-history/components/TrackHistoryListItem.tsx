import dayjs from 'dayjs';
import { FC, memo } from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface Props {
  id: string;
  track: string;
  artist: string;
  date: string;
}

const TrackHistoryListItem: FC<Props> = ({ track, artist, date }) => {
  return (
    <Card variant='outlined'>
      <CardContent sx={{ py: 1, px: 4 }}>
        <Typography gutterBottom variant='h6'>
          {artist} - {track}
        </Typography>
        <Typography gutterBottom variant='body2' fontStyle='italic' textAlign='right'>
          Listened on {dayjs(date).format('LLL')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default memo(TrackHistoryListItem, (prev, next) => prev.id === next.id);
