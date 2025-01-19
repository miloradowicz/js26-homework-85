import { Route, Routes } from 'react-router-dom';
import Header from './components/UI/Header/Header';
import { Container } from '@mui/material';
import Page404 from './containers/Page404/Page404';
import ArtistsViewer from './containers/ArtistsViewer/ArtistsViewer';
import AlbumsViewer from './containers/AlbumsViewer/AlbumsViewer';
import TracksViewer from './containers/TracksViewer/TracksViewer';
import SignIn from './containers/SignIn/SignIn';
import SignUp from './containers/SignUp/SignUp';

const App = () => {
  return (
    <>
      <Header />
      <Container sx={{ py: 3, px: 2 }}>
        <Routes>
          <Route path='/' element={<ArtistsViewer />} />
          <Route path='/artist/:id' element={<AlbumsViewer />} />
          <Route path='/album/:id' element={<TracksViewer />} />
          <Route path='/login' element={<SignIn />} />
          <Route path='/register' element={<SignUp />} />
          <Route path='*' element={<Page404 />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
