import { FC } from 'react';
import { Stack } from '@mui/material';

import { TrackHistoryRecord } from '../../../types';
import TrackHistoryListItem from './TrackHistoryListItem';

interface Props {
  list: TrackHistoryRecord[];
}

const TrackHistoryList: FC<Props> = ({ list }) => {
  return (
    <Stack gap={1}>
      {list.map((x) => (
        <TrackHistoryListItem key={x._id} id={x._id} track={x.track.title} artist={x.artist.name} date={x.date} />
      ))}
    </Stack>
  );
};

export default TrackHistoryList;
