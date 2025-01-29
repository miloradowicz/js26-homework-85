import { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';

import { baseURL } from '../../../constants';
import img404 from '../../../assets/images/404.svg';

interface Props {
  id: string;
  title: string;
  year: number;
  coverUrl: string | null;
  trackCount?: number;
}

const AlbumListItem: FC<Props> = ({ id, title, year, coverUrl, trackCount }) => {
  return (
    <Card component={Link} variant='outlined' sx={{ display: 'flex' }} to={`/album/${id}`}>
      <CardMedia
        sx={{ minHeight: 150, maxHeight: '100%', minWidth: 250, backgroundSize: 'contain' }}
        image={coverUrl ? new URL(coverUrl, new URL('images/', baseURL)).href : img404}
      />
      <CardContent>
        <Stack flex={1}>
          <Typography gutterBottom variant='h6' component='div'>
            {title}
          </Typography>
          <Typography gutterBottom variant='h6' component='div'>
            {year}
          </Typography>
          <Typography gutterBottom variant='h6' component='div'>
            {trackCount}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default memo(AlbumListItem, (prev, next) => prev.id === next.id);
