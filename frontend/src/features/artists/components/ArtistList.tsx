import { FC } from 'react';
import { Stack } from '@mui/material';

import { Artist } from '../../../types';
import ArtistListItem from './ArtistListItem';

interface Props {
  list: Artist[];
}

const ArtistList: FC<Props> = ({ list }) => {
  return (
    <Stack gap={1}>
      {list.map((x) => (
        <ArtistListItem key={x._id} id={x._id} name={x.name} photoUrl={x.photoUrl} />
      ))}
    </Stack>
  );
};

export default ArtistList;
