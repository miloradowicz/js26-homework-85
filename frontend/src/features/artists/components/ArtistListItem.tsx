import { FC, memo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Delete, Publish } from '@mui/icons-material';

import { baseURL } from '../../../constants';
import img404 from '../../../assets/images/404.svg';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';

interface Props {
  id: string;
  name: string;
  photoUrl: string | null;
  description: string | null;
  isPublished: boolean;
  uploadedBy: string;
  onPublish: () => Promise<void>;
  onDelete: () => Promise<void>;
}

const ArtistListItem: FC<Props> = ({
  id,
  name,
  photoUrl,
  description,
  isPublished,
  uploadedBy,
  onPublish,
  onDelete,
}) => {
  const user = useAppSelector(selectUser);
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
    <Card sx={{ maxWidth: 360, mx: 'auto' }}>
      <CardActionArea component={Link} to={`/artist/${id}`}>
        <CardMedia
          component='img'
          height='180'
          width='200'
          image={photoUrl ? new URL(photoUrl, new URL('images/', baseURL)).href : img404}
          alt={name}
          sx={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <CardContent>
          <Typography gutterBottom variant='h5' component='div'>
            {name}
          </Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {user && (user.role === 'admin' || uploadedBy === user._id) && !isPublished && (
          <Chip
            label='Unpublished'
            variant='outlined'
            deleteIcon={publishing ? <CircularProgress size={18} /> : <Publish />}
            onDelete={user && user.role === 'admin' ? handlePublish : undefined}
          />
        )}
        {user && (user.role === 'admin' || uploadedBy === user._id) && (
          <Chip
            label='Uploaded'
            variant='outlined'
            deleteIcon={deleting ? <CircularProgress size={18} /> : <Delete />}
            onDelete={handleDelete}
          />
        )}
      </CardActions>
    </Card>
  );
};

export default memo(ArtistListItem, (prev, next) => prev.id === next.id);
