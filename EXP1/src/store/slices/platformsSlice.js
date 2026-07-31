import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { mockApi } from '../../utils/mockApi';

const platformsAdapter = createEntityAdapter({
  selectId: (platform) => platform.id
});

const initialState = platformsAdapter.getInitialState({
  status: 'idle',
  error: null,
  activePlatformId: null
});

export const fetchPlatforms = createAsyncThunk(
  'platforms/fetchPlatforms',
  async (_, { rejectWithValue }) => {
    try {
      const platforms = await mockApi.fetchPlatforms();
      return platforms;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch platforms');
    }
  }
);

const platformsSlice = createSlice({
  name: 'platforms',
  initialState,
  reducers: {
    setActivePlatform: (state, action) => {
      state.activePlatformId = action.payload;
    },
    addPlatform: platformsAdapter.addOne,
    updatePlatform: platformsAdapter.updateOne,
    removePlatform: platformsAdapter.removeOne
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlatforms.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlatforms.fulfilled, (state, action) => {
        state.status = 'succeeded';
        platformsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPlatforms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const {
  selectAll: selectAllPlatforms,
  selectById: selectPlatformById,
  selectEntities: selectPlatformEntities
} = platformsAdapter.getSelectors(state => state.platforms);

export const { setActivePlatform, addPlatform, updatePlatform, removePlatform } = 
  platformsSlice.actions;

export default platformsSlice.reducer;