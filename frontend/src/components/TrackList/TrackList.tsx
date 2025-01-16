import { Stack } from '@mui/material';
import { TrackBody } from '../../types';
import { FC } from 'react';
import TrackListItem from './TrackListItem/TrackListItem';

interface Props {
  list: TrackBody[];
}

const TrackList: FC<Props> = ({ list }) => {
  return (
    <Stack gap={1}>
      {list.map((x) => (
        <TrackListItem key={x._id} id={x._id} title={x.title} trackNum={x.trackNum} length={x.length} />
      ))}
    </Stack>
  );
};

export default TrackList;
