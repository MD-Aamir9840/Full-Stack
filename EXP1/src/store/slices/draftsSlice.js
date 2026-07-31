import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { mockApi } from '../../utils/mockApi';

const draftsAdapter = createEntityAdapter({
  selectId: (draft) => draft.id,
  sortComparer: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
});

const initialState = draftsAdapter.getInitialState({
  status: 'idle',
  error: null,
  selectedDraftId: null
});

export const fetchDrafts = createAsyncThunk(
  'drafts/fetchDrafts',
  async (_, { rejectWithValue }) => {
    try {
      const drafts = await mockApi.fetchDrafts();
      return drafts;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch drafts');
    }
  }
);

export const saveDraft = createAsyncThunk(
  'drafts/saveDraft',
  async (draftData, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newDraft = {
        id: Date.now().toString(),
        ...draftData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft'
      };
      return newDraft;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to save draft');
    }
  }
);

export const deleteDraft = createAsyncThunk(
  'drafts/deleteDraft',
  async (id, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete draft');
    }
  }
);

const draftsSlice = createSlice({
  name: 'drafts',
  initialState,
  reducers: {
    setSelectedDraft: (state, action) => {
      state.selectedDraftId = action.payload;
    },
    clearSelectedDraft: (state) => {
      state.selectedDraftId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrafts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDrafts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        draftsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchDrafts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(saveDraft.fulfilled, (state, action) => {
        draftsAdapter.addOne(state, action.payload);
      })
      .addCase(deleteDraft.fulfilled, (state, action) => {
        draftsAdapter.removeOne(state, action.payload);
      });
  }
});

export const {
  selectAll: selectAllDrafts,
  selectById: selectDraftById
} = draftsAdapter.getSelectors(state => state.drafts);

export const { setSelectedDraft, clearSelectedDraft } = draftsSlice.actions;

export default draftsSlice.reducer;