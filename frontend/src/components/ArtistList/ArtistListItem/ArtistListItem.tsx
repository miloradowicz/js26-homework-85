import { Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import { FC, memo } from 'react';
import { baseURL } from '../../../constants';
import img404 from '../../../assets/images/404.svg';
import { Link } from 'react-router-dom';

interface Props {
  id: string;
  name: string;
  photoUrl: string | null;
}

const ArtistListItem: FC<Props> = ({ id, name, photoUrl }) => {
  return (
    <Card component={Link} variant='outlined' sx={{ display: 'flex' }} to={`/artist/${id}`}>
      <CardMedia
        sx={{ minHeight: 150, maxHeight: '100%', minWidth: 250, backgroundSize: 'contain' }}
        image={photoUrl ? new URL(photoUrl, new URL('images/', baseURL)).href : img404}
      />
      <Stack flex={1}>
        <CardContent>
          <Typography gutterBottom variant='h6' component='div'>
            {name}
          </Typography>
        </CardContent>
      </Stack>
    </Card>
  );
};

export default memo(ArtistListItem, (prev, next) => prev.id === next.id);
