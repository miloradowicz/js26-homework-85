import { Box, Grid2 as Grid, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import SidePanel from './components/SidePanel';

const AdminPage = () => {
  return (
    <Box maxWidth='md' mx='auto'>
      <Typography component='h1' variant='h4' gutterBottom>
        Admin page
      </Typography>
      <Grid container>
        <Grid size={{ xs: 12, sm: 3 }}>
          <SidePanel />
        </Grid>
        <Grid size={{ xs: 12, sm: 9 }}>
          <Outlet />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminPage;
