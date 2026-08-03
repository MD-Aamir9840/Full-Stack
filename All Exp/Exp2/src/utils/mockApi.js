// Mock API for simulating backend calls
export const mockApi = {
  generateId: () => Math.random().toString(36).substr(2, 9),

  posts: [
    {
      id: '1',
      title: 'Getting Started with Redux Toolkit',
      content: 'Redux Toolkit is the official, recommended way to write Redux logic. It simplifies store setup, reduces boilerplate, and includes powerful utilities like createSlice and createAsyncThunk.',
      author: 'John Doe',
      platformId: '1',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      engagement: { likes: 120, comments: 45, shares: 30, total: 195 },
      status: 'published',
      tags: ['redux', 'react', 'tutorial']
    },
    {
      id: '2',
      title: 'Advanced State Management Patterns',
      content: 'Learn how to handle complex state with Redux Toolkit, including normalized state, selectors, and performance optimization techniques for large-scale applications.',
      author: 'Jane Smith',
      platformId: '2',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      engagement: { likes: 85, comments: 32, shares: 18, total: 135 },
      status: 'published',
      tags: ['state-management', 'redux', 'performance']
    },
    {
      id: '3',
      title: 'Optimizing React Performance with Redux',
      content: 'Discover strategies to optimize React components using memoization, selectors, and efficient state updates with Redux Toolkit.',
      author: 'Bob Johnson',
      platformId: '1',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      engagement: { likes: 200, comments: 67, shares: 45, total: 312 },
      status: 'published',
      tags: ['performance', 'react', 'redux']
    },
    {
      id: '4',
      title: 'Building Scalable Applications with Redux',
      content: 'Learn how to structure large-scale applications with Redux Toolkit, including feature-based organization and code splitting.',
      author: 'Alice Williams',
      platformId: '3',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      engagement: { likes: 150, comments: 55, shares: 25, total: 230 },
      status: 'published',
      tags: ['architecture', 'scalability', 'redux']
    },
    {
      id: '5',
      title: 'Redux Toolkit Best Practices',
      content: 'A comprehensive guide to Redux Toolkit best practices including slice organization and selector usage.',
      author: 'John Doe',
      platformId: '4',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      engagement: { likes: 95, comments: 28, shares: 15, total: 138 },
      status: 'draft',
      tags: ['best-practices', 'redux-toolkit']
    }
  ],

  platforms: [
    { id: '1', name: 'Twitter', icon: '🐦', color: '#1DA1F2', type: 'social' },
    { id: '2', name: 'Facebook', icon: '📘', color: '#4267B2', type: 'social' },
    { id: '3', name: 'Instagram', icon: '📸', color: '#E4405F', type: 'social' },
    { id: '4', name: 'LinkedIn', icon: '💼', color: '#0A66C2', type: 'professional' }
  ],

  drafts: [
    {
      id: 'd1',
      title: 'Draft: Future of AI in Social Media',
      content: 'Exploring how AI is transforming social media management...',
      author: 'John Doe',
      platformId: '1',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: 'draft'
    }
  ],

  fetchPosts: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockApi.posts]);
      }, 800);
    });
  },

  fetchPostById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const post = mockApi.posts.find(p => p.id === id);
        if (post) {
          resolve({ ...post });
        } else {
          reject(new Error('Post not found'));
        }
      }, 500);
    });
  },

  createPost: (postData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPost = {
          id: mockApi.generateId(),
          ...postData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          engagement: { likes: 0, comments: 0, shares: 0, total: 0 }
        };
        mockApi.posts.unshift(newPost);
        resolve({ ...newPost });
      }, 600);
    });
  },

  // FIX 4: Complete updatePost with proper handling
  updatePost: (id, updates) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('🔍 Looking for post with id:', id);
        const index = mockApi.posts.findIndex(p => p.id === id);
        
        if (index !== -1) {
          // Keep the original id and create a clean updated post
          const updatedPost = {
            ...mockApi.posts[index],
            ...updates,
            id: mockApi.posts[index].id, // Ensure id doesn't change
            updatedAt: new Date().toISOString(),
            engagement: mockApi.posts[index].engagement // Preserve engagement
          };
          
          // Update the post in the array
          mockApi.posts[index] = updatedPost;
          
          console.log('✅ Updated post in mock API:', updatedPost);
          resolve({ ...updatedPost });
        } else {
          console.error('❌ Post not found with id:', id);
          reject(new Error('Post not found'));
        }
      }, 600);
    });
  },

  deletePost: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockApi.posts.findIndex(p => p.id === id);
        if (index !== -1) {
          mockApi.posts.splice(index, 1);
          resolve({ success: true });
        } else {
          reject(new Error('Post not found'));
        }
      }, 500);
    });
  },

  fetchPlatforms: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockApi.platforms]);
      }, 500);
    });
  },

  fetchDrafts: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockApi.drafts]);
      }, 400);
    });
  },

  // Update engagement (like, comment, share)
  updateEngagement: (postId, type) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockApi.posts.findIndex(p => p.id === postId);
        if (index !== -1) {
          const post = mockApi.posts[index];
          const engagement = { ...post.engagement };
          
          if (type === 'likes') {
            engagement.likes += 1;
            engagement.total += 1;
          } else if (type === 'comments') {
            engagement.comments += 1;
            engagement.total += 1;
          } else if (type === 'shares') {
            engagement.shares += 1;
            engagement.total += 1;
          }
          
          mockApi.posts[index] = {
            ...post,
            engagement
          };
          
          resolve({ success: true, engagement });
        } else {
          reject(new Error('Post not found'));
        }
      }, 300);
    });
  }
};