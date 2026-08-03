import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './slices/postsSlice';
import platformsReducer from './slices/platformsSlice';
import draftsReducer from './slices/draftsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    platforms: platformsReducer,
    drafts: draftsReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['posts/fetchPosts/pending', 'posts/fetchPosts/fulfilled', 'posts/fetchPosts/rejected'],
        ignoredPaths: ['posts.loading', 'posts.error']
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;