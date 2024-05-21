import { configureStore } from '@reduxjs/toolkit';
import rolesReducer from '../pages/roles/roles.reducer';
import usersReducer from '../pages/users/users.reducer';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    roles: rolesReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: Co
export type AppDispatch = typeof store.dispatch;
