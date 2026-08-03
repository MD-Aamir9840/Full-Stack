import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import PostList from './components/PostList';

function App() {
  return (
    <Provider store={store}>
      <div style={{ 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh'
      }}>
        <header style={{
          backgroundColor: 'white',
          padding: '20px 0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          marginBottom: '24px',
          borderBottom: '3px solid #1976d2'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ 
                  margin: 0, 
                  color: '#1976d2',
                  fontSize: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  🚀 Redux Toolkit Demo
                </h1>
                <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
                  Experiment 2.1 & 2.2: Centralized State Management with Optimized Selectors
                </p>
              </div>
              <div style={{ fontSize: '14px', color: '#777' }}>
                <span style={{ marginRight: '16px' }}>
                  🔄 Redux Toolkit
                </span>
                <span style={{ 
                  backgroundColor: '#4caf50',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>
                  v1.9.7
                </span>
              </div>
            </div>
          </div>
        </header>
        
        <PostList />
      </div>
    </Provider>
  );
}

export default App;