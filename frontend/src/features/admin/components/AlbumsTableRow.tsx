import { FC, useState } from 'react';
import { TableRow, TableCell, Tooltip, IconButton } from '@mui/material';
import { CheckCircle, CheckCircleOutline, PublicOff, Public, Delete } from '@mui/icons-material';

import { PopulatedAlbum } from '../../../types';

interface Props extends PopulatedAlbum {
  onTogglePublished: () => Promise<void>;
  onDelete: () => Promise<void>;
}

const AlbumsTableRow: FC<Props> = ({
  _id,
  title,
  artist,
  year,
  coverUrl,
  trackCount,
  isPublished,
  uploadedBy,
  onTogglePublished,
  onDelete,
}) => {
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleTogglePublished = async () => {
    try {
      setToggling(true);
      await onTogglePublished();
    } finally {
      setToggling(false);
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
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell component='th' scope='row'>
        {_id}
      </TableCell>
      <TableCell align='right'>{title}</TableCell>
      <TableCell align='right'>{artist?.name}</TableCell>
      <TableCell align='right'>{year}</TableCell>
      <TableCell align='right'>{coverUrl}</TableCell>
      <TableCell align='right'>{trackCount}</TableCell>
      <TableCell align='right'>
        <Tooltip title={isPublished ? 'Published' : 'Unpublished'}>
          {isPublished ? <CheckCircle /> : <CheckCircleOutline />}
        </Tooltip>
      </TableCell>
      <TableCell align='right'>{uploadedBy?.username}</TableCell>
      <TableCell align='right'>
        {
          <Tooltip title={isPublished ? 'Unpublish' : 'Publish'} placement='left'>
            <IconButton loading={toggling} onClick={handleTogglePublished}>
              {isPublished ? <PublicOff /> : <Public />}
            </IconButton>
          </Tooltip>
        }
        <Tooltip title='Delete' placement='left'>
          <IconButton loading={deleting} onClick={handleDelete}>
            <Delete />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default AlbumsTableRow;
