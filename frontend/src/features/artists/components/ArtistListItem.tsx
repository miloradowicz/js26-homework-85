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
  Tooltip,
  Typography,
} from '@mui/material';
import { Delete, Publish } from '@mui/icons-material';

import { baseURL } from '../../../constants';
import noImg from '../../../assets/images/no-img.svg';
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
          image={photoUrl ? new URL(photoUrl, new URL('images/', baseURL)).href : noImg}
          alt={name}
          sx={{ objectFit: photoUrl ? 'cover' : 'contain', objectPosition: 'center' }}
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

export default memo(ArtistListItem, (prev, next) => prev.id === next.id && prev.isPublished === next.isPublished);
