import { FC, useState } from 'react';
import { TableRow, TableCell, Tooltip, IconButton } from '@mui/material';
import { CheckCircle, CheckCircleOutline, PublicOff, Public, Delete } from '@mui/icons-material';

import { PopulatedArtist } from '../../../types';

interface Props extends PopulatedArtist {
  onTogglePublished: () => Promise<void>;
  onDelete: () => Promise<void>;
}

const ArtistTableRow: FC<Props> = ({
  _id,
  name,
  photoUrl,
  description,
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
      <TableCell align='right'>{name}</TableCell>
      <TableCell align='right'>{photoUrl}</TableCell>
      <TableCell align='right'>{description}</TableCell>
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

export default ArtistTableRow;
