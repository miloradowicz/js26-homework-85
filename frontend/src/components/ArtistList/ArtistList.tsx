import { Stack } from '@mui/material';
import ArtistListItem from './ArtistListItem/ArtistListItem';
import { Artist } from '../../types';
import { FC } from 'react';

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
