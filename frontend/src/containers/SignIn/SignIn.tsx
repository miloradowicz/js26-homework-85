import { Box, Container, Grid2 as Grid, Link } from '@mui/material';
import SignInForm from '../../components/SignInForm/SignInForm';
import { GenericError, SignInMutation, ValidationError } from '../../types';
import { useAppDispatch } from '../../app/hooks';
import { login } from '../../store/thunks/usersThunk';
import { Link as routerLink, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const SignIn = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (data: SignInMutation) => {
    try {
      await dispatch(login(data)).unwrap();
      navigate('/');
    } catch (e) {
      if (!(e as ValidationError).errors && (e as GenericError).error) {
        enqueueSnackbar((e as GenericError).error, { variant: 'error' });
      } else if ((e as Error).message) {
        enqueueSnackbar((e as Error).message, { variant: 'error' });
      }

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
        <SignInForm onSubmit={handleSubmit} />
        <Grid container justifyContent='flex-end'>
          <Grid>
            <Link component={routerLink} variant='body2' to='/register'>
              Not registered yet? Sign up
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SignIn;
