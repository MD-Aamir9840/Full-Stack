import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchPosts, 
  setFilter, 
  setPage
} from '../store/slices/postsSlice';
import { fetchPlatforms } from '../store/slices/platformsSlice';
import { fetchDrafts } from '../store/slices/draftsSlice';
import { addNotification, showModal } from '../store/slices/uiSlice';
import { 
  selectPaginatedPosts,
  selectPostStatistics,
  selectEngagementStats
} from '../store/selectors/postsSelectors';
import PostItem from './PostItem';
import PlatformFilter from './PlatformFilter';
import AnalyticsDashboard from './AnalyticsDashboard';
import CalendarView from './CalendarView';
import PostForm from './PostForm';

// Stats Summary Component
const StatsSummary = React.memo(({ statistics, engagementStats }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '12px',
      marginBottom: '20px',
      padding: '16px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#1976d2' }}>
          {statistics.total}
        </div>
        <div style={{ fontSize: '11px', color: '#777' }}>📝 Total Posts</div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#e91e63' }}>
          {engagementStats.totalLikes}
        </div>
        <div style={{ fontSize: '11px', color: '#777' }}>❤️ Likes</div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#4caf50' }}>
          {engagementStats.totalComments}
        </div>
        <div style={{ fontSize: '11px', color: '#777' }}>💬 Comments</div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#2196f3' }}>
          {engagementStats.totalShares}
        </div>
        <div style={{ fontSize: '11px', color: '#777' }}>🔄 Shares</div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#ff9800' }}>
          {engagementStats.totalEngagement}
        </div>
        <div style={{ fontSize: '11px', color: '#777' }}>📊 Total Engagement</div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#9c27b0' }}>
          {statistics.avgEngagement}
        </div>
        <div style={{ fontSize: '11px', color: '#777' }}>📈 Avg/Post</div>
      </div>
    </div>
  );
});

StatsSummary.displayName = 'StatsSummary';

// Main PostList Component
const PostList = React.memo(() => {
  const dispatch = useDispatch();
  
  const status = useSelector(state => state.posts.status);
  const error = useSelector(state => state.posts.error);
  const selectedId = useSelector(state => state.posts.selectedPostId);
  const filters = useSelector(state => state.posts.filters);
  const modals = useSelector(state => state.ui.modals);
  
  const paginatedData = useSelector(selectPaginatedPosts);
  const statistics = useSelector(selectPostStatistics);
  const engagementStats = useSelector(selectEngagementStats);
  
  const [searchInput, setSearchInput] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [sortBy, setSortBy] = useState('date');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchPosts()).unwrap(),
          dispatch(fetchPlatforms()).unwrap(),
          dispatch(fetchDrafts()).unwrap()
        ]);
        dispatch(addNotification({ type: 'success', message: 'All data loaded successfully' }));
      } catch (error) {
        dispatch(addNotification({ type: 'error', message: 'Failed to load data' }));
      }
    };
    fetchData();
  }, [dispatch]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    dispatch(setFilter({ searchTerm: searchInput }));
    dispatch(setPage(1));
  }, [dispatch, searchInput]);

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    dispatch(setFilter({ searchTerm: '' }));
    dispatch(setPage(1));
  }, [dispatch]);

  const handlePageChange = useCallback((page) => {
    dispatch(setPage(page));
  }, [dispatch]);

  const handleCreatePost = useCallback(() => {
    dispatch(showModal('createPost'));
    setRefreshKey(prev => prev + 1);
  }, [dispatch]);

  const sortedPosts = useMemo(() => {
    const sorted = [...paginatedData.items];
    switch (sortBy) {
      case 'date':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'engagement':
        return sorted.sort((a, b) => (b.engagement?.total || 0) - (a.engagement?.total || 0));
      case 'likes':
        return sorted.sort((a, b) => (b.engagement?.likes || 0) - (a.engagement?.likes || 0));
      case 'comments':
        return sorted.sort((a, b) => (b.engagement?.comments || 0) - (a.engagement?.comments || 0));
      case 'shares':
        return sorted.sort((a, b) => (b.engagement?.shares || 0) - (a.engagement?.shares || 0));
      case 'title':
        return sorted.sort((a, b) => a.title?.localeCompare(b.title) || 0);
      default:
        return sorted;
    }
  }, [paginatedData.items, sortBy]);

  if (status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '48px' }}>⏳</div>
        <div style={{ fontSize: '20px', color: '#666' }}>Loading posts...</div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px',
        backgroundColor: '#ffebee',
        borderRadius: '12px',
        margin: '20px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
        <h3 style={{ color: '#c62828', margin: '0' }}>Error Loading Posts</h3>
        <p style={{ color: '#666', margin: '10px 0' }}>{error || 'Something went wrong'}</p>
        <button 
          onClick={() => dispatch(fetchPosts())}
          style={{
            padding: '10px 28px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '10px'
          }}
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h2 style={{ margin: '0', fontSize: '28px' }}>
            📝 Posts ({statistics.total})
          </h2>
          <div style={{ fontSize: '14px', color: '#777', marginTop: '4px' }}>
            {statistics.published} published · {statistics.drafts} drafts · 
            Avg {statistics.avgEngagement} engagements
          </div>
        </div>
        <button 
          onClick={handleCreatePost}
          style={{
            padding: '10px 24px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ➕ Create Post
        </button>
      </div>

      <StatsSummary statistics={statistics} engagementStats={engagementStats} />

      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '20px',
        borderBottom: '2px solid #e0e0e0',
        paddingBottom: '8px'
      }}>
        {['list', 'analytics', 'calendar'].map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            style={{
              padding: '8px 20px',
              backgroundColor: viewMode === mode ? '#1976d2' : 'transparent',
              color: viewMode === mode ? 'white' : '#555',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: viewMode === mode ? 'bold' : 'normal'
            }}
          >
            {mode === 'list' && '📋 List'}
            {mode === 'analytics' && '📊 Analytics'}
            {mode === 'calendar' && '📅 Calendar'}
          </button>
        ))}
      </div>

      {viewMode === 'analytics' && <AnalyticsDashboard />}
      {viewMode === 'calendar' && <CalendarView />}

      {viewMode === 'list' && (
        <>
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            marginBottom: '20px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: 1 }}>
              <input
                type="text"
                placeholder="🔍 Search posts..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  minWidth: '200px'
                }}
              />
              <button 
                type="submit"
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Search
              </button>
            </form>
            
            {filters.searchTerm && (
              <button 
                onClick={handleClearSearch}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#757575',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ✕ Clear
              </button>
            )}
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="date">Sort by Date</option>
              <option value="engagement">Sort by Total Engagement</option>
              <option value="likes">Sort by Likes</option>
              <option value="comments">Sort by Comments</option>
              <option value="shares">Sort by Shares</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>

          <PlatformFilter />

          <div style={{ 
            fontSize: '14px', 
            color: '#777',
            marginBottom: '16px'
          }}>
            Showing {paginatedData.items.length} of {paginatedData.total} posts
            {filters.platform && ' (filtered by platform)'}
            {filters.searchTerm && ` (search: "${filters.searchTerm}")`}
          </div>

          {sortedPosts.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              backgroundColor: '#f5f5f5',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <h3 style={{ color: '#555', margin: '0' }}>No posts found</h3>
              <p style={{ color: '#777', margin: '8px 0' }}>
                Try adjusting your filters or create a new post
              </p>
            </div>
          ) : (
            sortedPosts.map(post => (
              <PostItem
                key={`${post.id}-${refreshKey}`}
                postId={post.id}
                isSelected={post.id === selectedId}
              />
            ))
          )}

          {paginatedData.totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '8px',
              marginTop: '24px',
              padding: '16px 0'
            }}>
              <button
                onClick={() => handlePageChange(paginatedData.currentPage - 1)}
                disabled={paginatedData.currentPage === 1}
                style={{
                  padding: '8px 16px',
                  backgroundColor: paginatedData.currentPage === 1 ? '#e0e0e0' : '#1976d2',
                  color: paginatedData.currentPage === 1 ? '#999' : 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: paginatedData.currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                ← Previous
              </button>
              
              {[...Array(paginatedData.totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: paginatedData.currentPage === index + 1 ? '#1976d2' : '#f5f5f5',
                    color: paginatedData.currentPage === index + 1 ? 'white' : '#333',
                    border: '2px solid transparent',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: paginatedData.currentPage === index + 1 ? 'bold' : 'normal'
                  }}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(paginatedData.currentPage + 1)}
                disabled={paginatedData.currentPage === paginatedData.totalPages}
                style={{
                  padding: '8px 16px',
                  backgroundColor: paginatedData.currentPage === paginatedData.totalPages ? '#e0e0e0' : '#1976d2',
                  color: paginatedData.currentPage === paginatedData.totalPages ? '#999' : 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: paginatedData.currentPage === paginatedData.totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {(modals.createPost || modals.editPost) && (
        <PostForm key={`postform-${refreshKey}`} />
      )}
    </div>
  );
});

PostList.displayName = 'PostList';
export default PostList;