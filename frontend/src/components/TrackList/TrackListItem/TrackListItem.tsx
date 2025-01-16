import { Card, CardContent, Stack, Typography } from '@mui/material';
import { FC, memo } from 'react';

interface Props {
  id: string;
  title: string;
  trackNum: number;
  length: string | null;
}

const TrackListItem: FC<Props> = ({ title, trackNum, length }) => {
  return (
    <Card variant='outlined' sx={{ display: 'flex' }}>
      <Stack flex={1}>
        <CardContent>
          <Typography gutterBottom variant='h6' component='div'>
            {title}
          </Typography>
          <Typography gutterBottom variant='h6' component='div'>
            {trackNum}
          </Typography>
          <Typography gutterBottom variant='h6' component='div'>
            {length}
          </Typography>
        </CardContent>
      </Stack>
    </Card>
  );
};

export default memo(TrackListItem, (prev, next) => prev.id === next.id);
