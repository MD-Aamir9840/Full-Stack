import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../store/slices/postsSlice';
import { selectAllPlatforms } from '../store/slices/platformsSlice';

const PlatformFilter = React.memo(() => {
  const dispatch = useDispatch();
  const platforms = useSelector(selectAllPlatforms);
  const currentPlatform = useSelector(state => state.posts.filters.platform);
  const statusFilter = useSelector(state => state.posts.filters.status);

  const handlePlatformClick = useCallback((platformId) => {
    dispatch(setFilter({ 
      platform: platformId === currentPlatform ? null : platformId 
    }));
  }, [dispatch, currentPlatform]);

  const handleStatusClick = useCallback((status) => {
    dispatch(setFilter({ 
      status: status === statusFilter ? 'all' : status 
    }));
  }, [dispatch, statusFilter]);

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <span style={{ fontWeight: 'bold', color: '#555', marginRight: '4px' }}>
          Platform:
        </span>
        <button
          onClick={() => handlePlatformClick(null)}
          style={{
            padding: '6px 16px',
            backgroundColor: !currentPlatform ? '#1976d2' : '#f0f0f0',
            color: !currentPlatform ? 'white' : '#555',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: !currentPlatform ? 'bold' : 'normal'
          }}
        >
          All
        </button>
        
        {platforms.map(platform => (
          <button
            key={platform.id}
            onClick={() => handlePlatformClick(platform.id)}
            style={{
              padding: '6px 16px',
              backgroundColor: currentPlatform === platform.id ? platform.color : '#f0f0f0',
              color: currentPlatform === platform.id ? 'white' : '#555',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: currentPlatform === platform.id ? 'bold' : 'normal',
              transition: 'all 0.2s'
            }}
          >
            {platform.icon} {platform.name}
          </button>
        ))}
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        flexWrap: 'wrap',
        alignItems: 'center',
        marginTop: '10px'
      }}>
        <span style={{ fontWeight: 'bold', color: '#555', marginRight: '4px' }}>
          Status:
        </span>
        {['all', 'published', 'draft'].map(status => (
          <button
            key={status}
            onClick={() => handleStatusClick(status)}
            style={{
              padding: '6px 16px',
              backgroundColor: statusFilter === status ? '#1976d2' : '#f0f0f0',
              color: statusFilter === status ? 'white' : '#555',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: statusFilter === status ? 'bold' : 'normal'
            }}
          >
            {status === 'all' && '📋 All'}
            {status === 'published' && '✅ Published'}
            {status === 'draft' && '📝 Draft'}
          </button>
        ))}
      </div>
    </div>
  );
});

PlatformFilter.displayName = 'PlatformFilter';
export default PlatformFilter;