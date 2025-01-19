import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../store/slices/usersSlice';

const Header = () => {
  const user = useAppSelector(selectUser);

  return (
    <AppBar position='static'>
      <Toolbar component='nav' sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h6' component={Link} color='white' sx={{ textDecoration: 'none' }} to='/'>
          Spuddify
        </Typography>
        {user ? (
          <Box display='flex' gap={2} alignItems='center'>
            {`Welcome, ${user.username}`}
            <Button component={Link} variant='contained' color='info' to='/track_history'>
              Track history
            </Button>
          </Box>
        ) : (
          <Box display='flex' gap={1}>
            <Button component={Link} variant='contained' color='info' to='/login'>
              Sign In
            </Button>
            <Button component={Link} variant='contained' color='info' to='/register'>
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
