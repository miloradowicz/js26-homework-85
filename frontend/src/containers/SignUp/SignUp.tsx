import { Box, Container, Grid2 as Grid, Link } from '@mui/material';
import UserForm from '../../components/UI/UserForm/UserForm';
import { UserMutation } from '../../types';
import { useAppDispatch } from '../../app/hooks';
import { register } from '../../store/thunks/usersThunk';
import { Link as routerLink, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (data: UserMutation) => {
    try {
      await dispatch(register(data)).unwrap();
      navigate('/');
    } catch {
      return;
    }
  };

  return (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <UserForm text='Sign Up' onSubmit={handleSubmit} />
        <Grid container justifyContent='flex-end'>
          <Grid>
            <Link component={routerLink} variant='body2' to='/login'>
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SignUp;
