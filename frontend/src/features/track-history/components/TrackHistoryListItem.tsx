import dayjs from 'dayjs';
import { FC, memo } from 'react';
import { TableCell, TableRow } from '@mui/material';

interface Props {
  id: string;
  track: string;
  artist: string;
  date: string;
}

const TrackHistoryListItem: FC<Props> = ({ track, artist, date }) => {
  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell>{artist}</TableCell>
      <TableCell>{track}</TableCell>
      <TableCell component='th' scope='row' align='right'>
        {dayjs(date).format('LLL')}
      </TableCell>
    </TableRow>
  );
};

export default memo(TrackHistoryListItem, (prev, next) => prev.id === next.id);
