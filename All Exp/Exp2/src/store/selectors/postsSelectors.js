import { createSelector } from '@reduxjs/toolkit';
import { selectAllPosts } from '../slices/postsSlice';
import { selectAllPlatforms } from '../slices/platformsSlice';

// Base selectors
export const selectPostsState = (state) => state.posts;
export const selectPlatformsState = (state) => state.platforms;
export const selectUIState = (state) => state.ui;

// 1. Memoized Filtered Posts
export const selectFilteredPosts = createSelector(
  [selectAllPosts, (state) => state.posts.filters],
  (posts, filters) => {
    let filtered = [...posts];
    
    if (filters.platform) {
      filtered = filtered.filter(post => post.platformId === filters.platform);
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(post => 
        post.title?.toLowerCase().includes(term) ||
        post.content?.toLowerCase().includes(term) ||
        post.author?.toLowerCase().includes(term)
      );
    }
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(post => post.status === filters.status);
    }
    
    return filtered;
  }
);

// 2. Posts with Platform Details
export const selectPostsWithPlatforms = createSelector(
  [selectAllPosts, selectAllPlatforms],
  (posts, platforms) => {
    const platformMap = platforms.reduce((acc, platform) => {
      acc[platform.id] = platform;
      return acc;
    }, {});
    
    return posts.map(post => ({
      ...post,
      platformName: platformMap[post.platformId]?.name || 'Unknown',
      platformIcon: platformMap[post.platformId]?.icon || '📱',
      platformColor: platformMap[post.platformId]?.color || '#666'
    }));
  }
);

// 3. Paginated Posts
export const selectPaginatedPosts = createSelector(
  [selectFilteredPosts, (state) => state.posts.pagination],
  (posts, pagination) => {
    const { currentPage, pageSize } = pagination;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      items: posts.slice(start, end),
      total: posts.length,
      currentPage,
      pageSize,
      totalPages: Math.ceil(posts.length / pageSize)
    };
  }
);

// 4. Post Statistics
export const selectPostStatistics = createSelector(
  [selectAllPosts, selectAllPlatforms],
  (posts, platforms) => {
    const total = posts.length;
    const published = posts.filter(p => p.status === 'published').length;
    const drafts = posts.filter(p => p.status === 'draft').length;
    
    const totalEngagement = posts.reduce((sum, p) => sum + (p.engagement?.total || 0), 0);
    const avgEngagement = total > 0 ? Math.round(totalEngagement / total) : 0;
    
    const byPlatform = platforms.map(platform => ({
      ...platform,
      postCount: posts.filter(post => post.platformId === platform.id).length,
      engagement: posts
        .filter(post => post.platformId === platform.id)
        .reduce((sum, p) => sum + (p.engagement?.total || 0), 0)
    }));
    
    const recentPosts = posts.filter(post => {
      const daysAgo = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo <= 7;
    }).length;
    
    const mostEngagedPost = posts.length > 0 ? 
      posts.reduce((max, post) => 
        (post.engagement?.total || 0) > (max.engagement?.total || 0) ? post : max
      ) : null;
    
    return {
      total,
      published,
      drafts,
      totalEngagement,
      avgEngagement,
      byPlatform,
      recentPosts,
      mostEngagedPost
    };
  }
);

// 5. Calendar View Data
export const selectPostsByDate = createSelector(
  [selectAllPosts],
  (posts) => {
    const postsByDate = {};
    
    posts.forEach(post => {
      const date = new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      
      if (!postsByDate[date]) {
        postsByDate[date] = [];
      }
      postsByDate[date].push(post);
    });
    
    const sortedDates = Object.keys(postsByDate).sort((a, b) => 
      new Date(a) - new Date(b)
    );
    
    return {
      dates: sortedDates,
      postsByDate,
      totalDates: sortedDates.length,
      totalPosts: posts.length
    };
  }
);

// 6. Analytics Data
export const selectAnalyticsData = createSelector(
  [selectAllPosts, selectAllPlatforms],
  (posts, platforms) => {
    const platformStats = platforms.map(platform => {
      const platformPosts = posts.filter(p => p.platformId === platform.id);
      const totalEngagement = platformPosts.reduce((sum, p) => sum + (p.engagement?.total || 0), 0);
      
      return {
        ...platform,
        postCount: platformPosts.length,
        totalEngagement,
        avgEngagement: platformPosts.length > 0 ? 
          Math.round(totalEngagement / platformPosts.length) : 0
      };
    });
    
    return {
      platformStats,
      totalPosts: posts.length
    };
  }
);

// 7. Real-time Engagement Stats - COMPLETE
export const selectEngagementStats = createSelector(
  [selectAllPosts],
  (posts) => {
    const totalPosts = posts.length;
    
    // Calculate totals for each engagement type
    const totalLikes = posts.reduce((sum, p) => sum + (p.engagement?.likes || 0), 0);
    const totalComments = posts.reduce((sum, p) => sum + (p.engagement?.comments || 0), 0);
    const totalShares = posts.reduce((sum, p) => sum + (p.engagement?.shares || 0), 0);
    const totalEngagement = totalLikes + totalComments + totalShares;
    
    // Calculate averages
    const avgLikes = totalPosts > 0 ? Math.round(totalLikes / totalPosts) : 0;
    const avgComments = totalPosts > 0 ? Math.round(totalComments / totalPosts) : 0;
    const avgShares = totalPosts > 0 ? Math.round(totalShares / totalPosts) : 0;
    const avgEngagement = totalPosts > 0 ? Math.round(totalEngagement / totalPosts) : 0;
    
    // Find most liked, commented, shared posts
    const mostLiked = posts.length > 0 ? 
      posts.reduce((max, post) => 
        (post.engagement?.likes || 0) > (max.engagement?.likes || 0) ? post : max
      ) : null;
    
    const mostCommented = posts.length > 0 ? 
      posts.reduce((max, post) => 
        (post.engagement?.comments || 0) > (max.engagement?.comments || 0) ? post : max
      ) : null;
    
    const mostShared = posts.length > 0 ? 
      posts.reduce((max, post) => 
        (post.engagement?.shares || 0) > (max.engagement?.shares || 0) ? post : max
      ) : null;
    
    return {
      totalPosts,
      totalLikes,
      totalComments,
      totalShares,
      totalEngagement,
      avgLikes,
      avgComments,
      avgShares,
      avgEngagement,
      mostLiked,
      mostCommented,
      mostShared
    };
  }
);

// 8. Sort Selectors with Engagement
export const selectPostsSortedByLikes = createSelector(
  [selectAllPosts],
  (posts) => {
    return [...posts].sort((a, b) => (b.engagement?.likes || 0) - (a.engagement?.likes || 0));
  }
);

export const selectPostsSortedByComments = createSelector(
  [selectAllPosts],
  (posts) => {
    return [...posts].sort((a, b) => (b.engagement?.comments || 0) - (a.engagement?.comments || 0));
  }
);

export const selectPostsSortedByShares = createSelector(
  [selectAllPosts],
  (posts) => {
    return [...posts].sort((a, b) => (b.engagement?.shares || 0) - (a.engagement?.shares || 0));
  }
);

export const selectPostsSortedByEngagement = createSelector(
  [selectAllPosts],
  (posts) => {
    return [...posts].sort((a, b) => (b.engagement?.total || 0) - (a.engagement?.total || 0));
  }
);