import { FC } from 'react';
import { Stack } from '@mui/material';

import { TrackBody } from '../../../types';
import TrackListItem from './TrackListItem';

interface Props {
  list: TrackBody[];
  onPlay?: (id: string) => Promise<void>;
}

const TrackList: FC<Props> = ({ list, onPlay }) => {
  return (
    <Stack gap={1}>
      {list.map((x) => (
        <TrackListItem
          key={x._id}
          id={x._id}
          title={x.title}
          trackNum={x.trackNum}
          length={x.length}
          youTubeUrl={x.youTubeUrl}
          onPlay={onPlay ? async () => await onPlay(x._id) : undefined}
        />
      ))}
    </Stack>
  );
};

export default TrackList;
