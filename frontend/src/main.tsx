import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { CssBaseline } from '@mui/material';
import '@fontsource/roboto/cyrillic.css';

import App from './App.tsx';
import { SnackbarProvider } from 'notistack';
import { store } from './app/store.ts';

createRoot(document.getElementById('root')!).render(
  <>
    <CssBaseline />
    <Provider store={store}>
      <BrowserRouter>
        <SnackbarProvider autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} maxSnack={1}>
          <App />
        </SnackbarProvider>
      </BrowserRouter>
    </Provider>
  </>
);
