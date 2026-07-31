import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { mockApi } from '../../utils/mockApi';

// Entity Adapter for state normalization
const postsAdapter = createEntityAdapter({
  selectId: (post) => post.id,
  sortComparer: (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
});

// Initial state
const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null,
  selectedPostId: null,
  filters: {
    platform: null,
    searchTerm: '',
    status: 'all',
    dateRange: {
      start: null,
      end: null
    }
  },
  pagination: {
    currentPage: 1,
    pageSize: 5,
    totalItems: 0
  }
});

// Async Thunks
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const posts = await mockApi.fetchPosts();
      return posts;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch posts');
    }
  }
);

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (id, { rejectWithValue }) => {
    try {
      const post = await mockApi.fetchPostById(id);
      return post;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch post');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const newPost = await mockApi.createPost(postData);
      return newPost;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create post');
    }
  }
);

// FIX 3: Updated updatePost with debug logs
export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      console.log('🔄 Updating post:', { id, updates }); // Debug log
      const updatedPost = await mockApi.updatePost(id, updates);
      console.log('✅ Updated post received:', updatedPost); // Debug log
      return updatedPost;
    } catch (error) {
      console.error('❌ Update failed:', error);
      return rejectWithValue(error.message || 'Failed to update post');
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id, { rejectWithValue }) => {
    try {
      await mockApi.deletePost(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete post');
    }
  }
);

// Thunk for updating engagement (like, comment, share)
export const updateEngagement = createAsyncThunk(
  'posts/updateEngagement',
  async ({ postId, type }, { rejectWithValue }) => {
    try {
      const result = await mockApi.updateEngagement(postId, type);
      return { id: postId, engagement: result.engagement };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update engagement');
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: postsAdapter.addOne,
    updatePostLocal: postsAdapter.updateOne,
    deletePostLocal: postsAdapter.removeOne,
    addPosts: postsAdapter.addMany,
    setSelectedPost: (state, action) => {
      state.selectedPostId = action.payload;
    },
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        platform: null,
        searchTerm: '',
        status: 'all',
        dateRange: { start: null, end: null }
      };
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
    clearSelectedPost: (state) => {
      state.selectedPostId = null;
    },
    // Local engagement update (optimistic update)
    updateEngagementLocal: (state, action) => {
      const { id, engagement } = action.payload;
      postsAdapter.updateOne(state, {
        id,
        changes: { engagement }
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        postsAdapter.setAll(state, action.payload);
        state.pagination.totalItems = action.payload.length;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch posts';
      })
      .addCase(fetchPostById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        postsAdapter.upsertOne(state, action.payload);
        state.selectedPostId = action.payload.id;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch post';
      })
      .addCase(createPost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        postsAdapter.addOne(state, action.payload);
        state.pagination.totalItems += 1;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to create post';
      })
      // FIX 3: Update post reducers with better handling
      .addCase(updatePost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log('📦 Updating state with:', action.payload);
        postsAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload
        });
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update post';
        console.error('❌ Update rejected:', action.payload);
      })
      .addCase(deletePost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        postsAdapter.removeOne(state, action.payload);
        state.pagination.totalItems -= 1;
        if (state.selectedPostId === action.payload) {
          state.selectedPostId = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to delete post';
      })
      .addCase(updateEngagement.fulfilled, (state, action) => {
        const { id, engagement } = action.payload;
        postsAdapter.updateOne(state, {
          id,
          changes: { engagement }
        });
      })
      .addCase(updateEngagement.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update engagement';
      });
  }
});

// Export selectors
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  selectEntities: selectPostEntities,
  selectTotal: selectTotalPosts
} = postsAdapter.getSelectors(state => state.posts);

export const {
  addPost,
  updatePostLocal,
  deletePostLocal,
  addPosts,
  setSelectedPost,
  setFilter,
  clearFilters,
  setPage,
  resetStatus,
  clearSelectedPost,
  updateEngagementLocal
} = postsSlice.actions;

export default postsSlice.reducer;