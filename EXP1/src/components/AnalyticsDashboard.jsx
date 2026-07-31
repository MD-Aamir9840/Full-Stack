import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectPostStatistics, selectAnalyticsData, selectEngagementStats } from '../store/selectors/postsSelectors';

const AnalyticsDashboard = React.memo(() => {
  const statistics = useSelector(selectPostStatistics);
  const analytics = useSelector(selectAnalyticsData);
  const engagementStats = useSelector(selectEngagementStats);

  const trendData = useMemo(() => {
    return analytics.platformStats.map(stat => ({
      ...stat,
      engagementPerPost: stat.postCount > 0 ? 
        Math.round(stat.totalEngagement / stat.postCount) : 0
    }));
  }, [analytics]);

  return (
    <div style={{ marginBottom: '30px' }}>
      <h3 style={{ marginBottom: '20px' }}>📊 Analytics Dashboard</h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1976d2' }}>
            {statistics.total}
          </div>
          <div style={{ color: '#777', fontSize: '14px' }}>Total Posts</div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>❤️</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#e91e63' }}>
            {engagementStats.totalLikes}
          </div>
          <div style={{ color: '#777', fontSize: '14px' }}>Total Likes</div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4caf50' }}>
            {engagementStats.totalComments}
          </div>
          <div style={{ color: '#777', fontSize: '14px' }}>Total Comments</div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ff9800' }}>
            {statistics.avgEngagement}
          </div>
          <div style={{ color: '#777', fontSize: '14px' }}>Avg Engagement</div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>⭐</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#9c27b0' }}>
            {engagementStats.avgLikes}
          </div>
          <div style={{ color: '#777', fontSize: '14px' }}>Avg Likes/Post</div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📅</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4caf50' }}>
            {statistics.recentPosts}
          </div>
          <div style={{ color: '#777', fontSize: '14px' }}>Recent Posts (7d)</div>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: '20px'
      }}>
        <h4 style={{ marginTop: '0', marginBottom: '16px' }}>📊 Performance by Platform</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {trendData.map(stat => (
            <div key={stat.id}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '4px',
                fontSize: '14px'
              }}>
                <span>
                  {stat.icon} {stat.name}
                </span>
                <span style={{ color: '#555' }}>
                  {stat.postCount} posts · {stat.totalEngagement} engagements
                </span>
              </div>
              <div style={{
                backgroundColor: '#f5f5f5',
                borderRadius: '6px',
                height: '8px',
                overflow: 'hidden'
              }}>
                <div style={{
                  backgroundColor: stat.color || '#1976d2',
                  height: '100%',
                  width: `${Math.min((stat.postCount / statistics.total) * 100, 100)}%`,
                  transition: 'width 0.5s ease'
                }} />
              </div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                {stat.engagementPerPost} avg engagement per post
              </div>
            </div>
          ))}
        </div>
      </div>

      {statistics.mostEngagedPost && (
        <div style={{
          backgroundColor: '#e8f5e9',
          padding: '16px',
          borderRadius: '10px',
          border: '1px solid #c8e6c9'
        }}>
          <div style={{ fontSize: '14px', color: '#2e7d32', fontWeight: 'bold', marginBottom: '4px' }}>
            🏆 Most Engaged Post
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
            {statistics.mostEngagedPost.title}
          </div>
          <div style={{ fontSize: '14px', color: '#555' }}>
            {statistics.mostEngagedPost.engagement?.total || 0} engagements · 
            {statistics.mostEngagedPost.engagement?.likes || 0} likes
          </div>
        </div>
      )}
    </div>
  );
});

AnalyticsDashboard.displayName = 'AnalyticsDashboard';
export default AnalyticsDashboard;