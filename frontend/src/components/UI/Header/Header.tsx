import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position='static'>
      <Toolbar component='nav'>
        <Typography variant='h6' component={Link} color='white' sx={{ textDecoration: 'none' }} to='/'>
          Spuddify
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
