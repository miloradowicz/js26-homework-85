import { List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const SidePanel = () => {
  return (
    <>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <ListItem component={Link} to='/admin/artists'>
          <ListItemText primary='Artists' />
        </ListItem>
        <ListItem component={Link} to='/admin/albums'>
          <ListItemText primary='Albums' />
        </ListItem>
        <ListItem component={Link} to='/admin/tracks'>
          <ListItemText primary='Tracks' />
        </ListItem>
      </List>
    </>
  );
};

export default SidePanel;
