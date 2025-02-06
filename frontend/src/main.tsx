import dayjs from 'dayjs';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { BrowserRouter } from 'react-router-dom';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { SnackbarProvider } from 'notistack';
import { CssBaseline } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import '@fontsource/roboto/cyrillic.css';

import { GOOGLE_CLIENT_ID } from './constants';
import { persistor, store } from './app/store';
import { addAuthorization } from './api';
import App from './App.tsx';

addAuthorization(store);
dayjs.extend(localizedFormat);

createRoot(document.getElementById('root')!).render(
  <>
    <CssBaseline />
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <SnackbarProvider
            autoHideDuration={3000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            maxSnack={1}
          >
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <App />
            </GoogleOAuthProvider>
          </SnackbarProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </>,
);
