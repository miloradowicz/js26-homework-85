import { Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';

import { useAppSelector } from './app/hooks';
import { selectUser } from './features/users/usersSlice';
import Header from './components/UI/Header/Header';
import ArtistsViewer from './features/artists/containers/ArtistsViewer';
import AlbumsViewer from './features/albums/containers/AlbumsViewer';
import TracksViewer from './features/tracks/containers/TracksViewer';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ArtistCreator from './features/artists/containers/ArtistCreator';
import AlbumCreator from './features/albums/containers/AlbumCreator';
import TrackCreator from './features/tracks/containers/TrackCreator';
import TrackHistoryViewer from './features/track-history/containers/TrackHistoryViewer';
import SignIn from './features/users/containers/SignIn';
import SignUp from './features/users/containers/SignUp';
import Page404 from './components/Page404/Page404';
import AdminPage from './features/admin/AdminPage';

const App = () => {
  const user = useAppSelector(selectUser);

  return (
    <>
      <Header />
      <Container sx={{ py: 8, px: 2, minWidth: 360 }}>
        <Routes>
          <Route path='/' element={<ArtistsViewer />} />
          <Route path='/artist/:id' element={<AlbumsViewer />} />
          <Route path='/album/:id' element={<TracksViewer />} />
          <Route path='/artist/not-found' element={<Page404 />} />
          <Route path='/album/not-found' element={<Page404 />} />
          <Route
            path='/artist/new'
            element={
              <ProtectedRoute isAllowed={user?.role === 'user' || user?.role === 'admin'}>
                <ArtistCreator />
              </ProtectedRoute>
            }
          />
          <Route
            path='/album/new'
            element={
              <ProtectedRoute isAllowed={user?.role === 'user' || user?.role === 'admin'}>
                <AlbumCreator />
              </ProtectedRoute>
            }
          />
          <Route
            path='/track/new'
            element={
              <ProtectedRoute isAllowed={user?.role === 'user' || user?.role === 'admin'}>
                <TrackCreator />
              </ProtectedRoute>
            }
          />
          <Route
            path='/track_history'
            element={
              <ProtectedRoute isAllowed={user?.role === 'user' || user?.role === 'admin'}>
                <TrackHistoryViewer />
              </ProtectedRoute>
            }
          />
          <Route path='/login' element={<SignIn />} />
          <Route path='/register' element={<SignUp />} />
          <Route
            path='/admin'
            element={
              <ProtectedRoute isAllowed={user?.role === 'admin'}>
                <AdminPage />
              </ProtectedRoute>
            }
          >
            <Route path='/artists' element={<SignUp />} />
            <Route path='/albums' element={<SignUp />} />
            <Route path='/tracks' element={<SignUp />} />
          </Route>
          <Route path='*' element={<Page404 />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
