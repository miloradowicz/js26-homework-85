import { FC } from 'react';
import { Stack } from '@mui/material';

import { AlbumBody } from '../../../types';
import AlbumListItem from './AlbumListItem';

interface Props {
  list: AlbumBody[];
}

const AlbumList: FC<Props> = ({ list }) => {
  return (
    <Stack gap={1}>
      {list.map((x) => (
        <AlbumListItem
          key={x._id}
          id={x._id}
          title={x.title}
          year={x.year}
          coverUrl={x.coverUrl}
          trackCount={x.trackCount}
        />
      ))}
    </Stack>
  );
};

export default AlbumList;
