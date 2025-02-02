import { Link as routerLink, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Box, Container, Grid2 as Grid, Link } from '@mui/material';

import { AuthenticationError, GenericError, SignUpMutation } from '../../../types';
import { useAppDispatch } from '../../../app/hooks';
import { register } from '../usersThunk';
import SignUpForm from '../components/SignUpForm';

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (data: SignUpMutation) => {
    try {
      await dispatch(register(data)).unwrap();
      navigate(-1);
    } catch (e) {
      if (!(e as AuthenticationError).errors && (e as GenericError).error) {
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
        <SignUpForm onSubmit={handleSubmit} />
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
