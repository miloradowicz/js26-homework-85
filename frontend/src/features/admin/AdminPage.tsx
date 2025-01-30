import { Box, Grid2 as Grid, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import TopPanel from './components/TopPanel';

const AdminPage = () => {
  return (
    <Box maxWidth='lg' mx='auto'>
      <Typography component='h1' variant='h4' gutterBottom>
        Admin page
      </Typography>
      <Grid container direction='column' py={2}>
        <Grid size={12}>
          <TopPanel />
        </Grid>
        <Grid size={12}>
          <Outlet />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminPage;
