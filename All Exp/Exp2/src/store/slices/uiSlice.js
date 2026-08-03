import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  sidebarOpen: true,
  notifications: [],
  modals: {
    createPost: false,
    editPost: false,
    deleteConfirm: false,
    viewPost: false
  },
  loadingOverlay: false,
  lastAction: null
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    showModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    hideModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
        read: false,
        timestamp: new Date().toISOString()
      });
      if (state.notifications.length > 10) {
        state.notifications = state.notifications.slice(-10);
      }
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setLoadingOverlay: (state, action) => {
      state.loadingOverlay = action.payload;
    },
    setLastAction: (state, action) => {
      state.lastAction = action.payload;
    }
  }
});

export const {
  toggleTheme,
  toggleSidebar,
  showModal,
  hideModal,
  addNotification,
  markNotificationRead,
  clearNotifications,
  setLoadingOverlay,
  setLastAction
} = uiSlice.actions;

export default uiSlice.reducer;