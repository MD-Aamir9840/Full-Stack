// src/features/counters/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Step 5.1: Define initial state with 4 counters
const initialState = {
  counter1: 0,
  counter2: 0,
  counter3: 0,
  counter4: 0,
};

// Step 5.2: Define relationship between counters
// When counter1 changes, these formulas auto-update others
const updateRelatedCounters = (state) => {
  state.counter2 = state.counter1 * 2;           // counter2 = 2× counter1
  state.counter3 = state.counter1 + state.counter2; // counter3 = sum
  state.counter4 = (state.counter1 * state.counter2) / 2; // counter4 = product/2
};

// Step 5.3: Create the slice
const counterSlice = createSlice({
  name: 'counters',
  initialState,
  reducers: {
    // === Actions that update counter1 (auto-sync all others) ===
    
    // Increment counter1 by 1
    incrementCounter1: (state) => {
      state.counter1 += 1;
      updateRelatedCounters(state); // Auto-update others
    },
    
    // Decrement counter1 by 1
    decrementCounter1: (state) => {
      state.counter1 -= 1;
      updateRelatedCounters(state); // Auto-update others
    },
    
    // Set counter1 to a specific value
    setCounter1: (state, action) => {
      state.counter1 = action.payload;
      updateRelatedCounters(state); // Auto-update others
    },
    
    // Reset all counters to 0
    resetAll: (state) => {
      state.counter1 = 0;
      state.counter2 = 0;
      state.counter3 = 0;
      state.counter4 = 0;
    },

    // === Actions that update individual counters (NO auto-sync) ===
    
    // Update only counter2
    setCounter2: (state, action) => {
      state.counter2 = action.payload;
    },
    
    // Update only counter3
    setCounter3: (state, action) => {
      state.counter3 = action.payload;
    },
    
    // Update only counter4
    setCounter4: (state, action) => {
      state.counter4 = action.payload;
    },
  },
});

// Step 5.4: Export all actions
export const {
  incrementCounter1,
  decrementCounter1,
  setCounter1,
  resetAll,
  setCounter2,
  setCounter3,
  setCounter4,
} = counterSlice.actions;

// Step 5.5: Export selector to get all counters
export const selectAllCounters = (state) => state.counters;

// Step 5.6: Export the reducer
export default counterSlice.reducer;