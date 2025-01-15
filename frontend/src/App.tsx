import { Route, Routes } from 'react-router-dom';
import Header from './components/UI/Header/Header';
import { Container } from '@mui/material';
import Page404 from './containers/Page404/Page404';

const App = () => {
  return (
    <>
      <Header />
      <Container sx={{ py: 3, px: 2 }}>
        <Routes>
          <Route path='*' element={<Page404 />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
