import { configureStore } from '@reduxjs/toolkit';
import rolesReducer from '../pages/roles/roles.reducer';
import usersReducer from '../pages/users/users.reducer';

import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import settingsReducer from './settings/settingsSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    roles: rolesReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });
  },
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: Co
export type AppDispatch = typeof store.dispatch;
