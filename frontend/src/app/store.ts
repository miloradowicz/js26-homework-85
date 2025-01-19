import { configureStore } from '@reduxjs/toolkit';
import { users } from '../store/slices/usersSlice';
import storage from 'redux-persist/lib/storage';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';

const usersPersistConfig = {
  key: 'store:users',
  storage,
  whitelist: ['user'],
};

export const store = configureStore({
  reducer: {
    users: persistReducer(usersPersistConfig, users),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
