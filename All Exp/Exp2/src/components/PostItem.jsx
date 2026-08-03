import React, { memo, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, setSelectedPost, updateEngagement, updateEngagementLocal } from '../store/slices/postsSlice';
import { showModal, addNotification } from '../store/slices/uiSlice';
import { selectPostById } from '../store/slices/postsSlice';

// Comment Dialog Component (keep as is)
const CommentDialog = memo(({ post, onClose, onSubmit }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!comment.trim()) return;
    setIsSubmitting(true);
    await onSubmit(comment.trim());
    setComment('');
    setIsSubmitting(false);
    onClose();
  }, [comment, onSubmit, onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      animation: 'fadeIn 0.2s ease'
    }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        animation: 'slideUp 0.3s ease'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h3 style={{ margin: '0', color: '#1976d2' }}>💬 Add Comment</h3>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#999',
            padding: '0 8px'
          }}>✕</button>
        </div>

        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <div style={{ fontSize: '14px', color: '#555' }}>
            <strong>{post.title}</strong>
          </div>
          <div style={{ fontSize: '13px', color: '#777', marginTop: '4px' }}>
            {post.content?.substring(0, 100)}...
          </div>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment here..."
          rows="4"
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            resize: 'vertical',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#1976d2'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          autoFocus
        />

        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            padding: '10px 24px',
            backgroundColor: '#f5f5f5',
            color: '#555',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={!comment.trim() || isSubmitting}
            style={{
              padding: '10px 24px',
              backgroundColor: !comment.trim() || isSubmitting ? '#ccc' : '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: !comment.trim() || isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: !comment.trim() || isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? 'Posting...' : '💬 Post Comment'}
          </button>
        </div>
      </div>
    </div>
  );
});

CommentDialog.displayName = 'CommentDialog';

// Share Options Component (keep as is)
const ShareOptions = memo(({ post, onClose, onShare }) => {
  const platforms = [
    { id: 'twitter', name: 'Twitter', icon: '🐦', color: '#1DA1F2' },
    { id: 'facebook', name: 'Facebook', icon: '📘', color: '#4267B2' },
    { id: 'instagram', name: 'Instagram', icon: '📸', color: '#E4405F' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0A66C2' },
    { id: 'whatsapp', name: 'WhatsApp', icon: '💬', color: '#25D366' },
    { id: 'telegram', name: 'Telegram', icon: '✈️', color: '#0088cc' },
    { id: 'copy', name: 'Copy Link', icon: '📋', color: '#757575' }
  ];

  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = useCallback(async (platform) => {
    setSelectedPlatform(platform);
    setIsSharing(true);
    await onShare(platform);
    setIsSharing(false);
    onClose();
  }, [onShare, onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      animation: 'fadeIn 0.2s ease'
    }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '450px',
        width: '90%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        animation: 'slideUp 0.3s ease'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h3 style={{ margin: '0', color: '#1976d2' }}>🔄 Share Post</h3>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#999',
            padding: '0 8px'
          }}>✕</button>
        </div>

        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '14px', color: '#555' }}>
            <strong>{post.title}</strong>
          </div>
          <div style={{ fontSize: '13px', color: '#777', marginTop: '4px' }}>
            Share this post to your network
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '16px'
        }}>
          {platforms.map(platform => (
            <button
              key={platform.id}
              onClick={() => handleShare(platform.id)}
              disabled={isSharing && selectedPlatform === platform.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 12px',
                backgroundColor: selectedPlatform === platform.id ? platform.color : '#f5f5f5',
                color: selectedPlatform === platform.id ? 'white' : '#333',
                border: selectedPlatform === platform.id ? `2px solid ${platform.color}` : '2px solid transparent',
                borderRadius: '10px',
                cursor: isSharing && selectedPlatform === platform.id ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: isSharing && selectedPlatform === platform.id ? 0.6 : 1,
                fontSize: '14px',
                fontWeight: selectedPlatform === platform.id ? 'bold' : 'normal'
              }}
              onMouseEnter={(e) => {
                if (!isSharing) {
                  e.target.style.backgroundColor = platform.color;
                  e.target.style.color = 'white';
                  e.target.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSharing && selectedPlatform !== platform.id) {
                  e.target.style.backgroundColor = '#f5f5f5';
                  e.target.style.color = '#333';
                  e.target.style.transform = 'scale(1)';
                }
              }}
            >
              <span style={{ fontSize: '28px' }}>{platform.icon}</span>
              <span>{platform.name}</span>
              {isSharing && selectedPlatform === platform.id && (
                <span style={{ fontSize: '12px' }}>⏳ Sharing...</span>
              )}
            </button>
          ))}
        </div>

        <div style={{
          fontSize: '12px',
          color: '#999',
          textAlign: 'center',
          borderTop: '1px solid #f0f0f0',
          paddingTop: '12px'
        }}>
          💡 Tip: Click on any platform to share
        </div>
      </div>
    </div>
  );
});

ShareOptions.displayName = 'ShareOptions';

// Main PostItem Component
const PostItem = memo(({ postId, isSelected }) => {
  const dispatch = useDispatch();
  const [isLiking, setIsLiking] = useState(false);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  const post = useSelector(state => selectPostById(state, postId));
  const platform = useSelector(state => 
    state.platforms.entities[post?.platformId] || null
  );
  
  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(post.id))
        .unwrap()
        .then(() => {
          dispatch(addNotification({ type: 'success', message: 'Post deleted successfully' }));
        })
        .catch((error) => {
          dispatch(addNotification({ type: 'error', message: error || 'Failed to delete post' }));
        });
    }
  }, [dispatch, post?.id]);

  // FIXED: Edit handler - properly set selected post and open modal
  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    // First set the selected post ID
    dispatch(setSelectedPost(post.id));
    // Then open the edit modal
    dispatch(showModal('editPost'));
  }, [dispatch, post?.id]);

  const handleSelect = useCallback(() => {
    dispatch(setSelectedPost(post.id));
  }, [dispatch, post?.id]);

  // Handle Like
  const handleLike = useCallback(async (e) => {
    e.stopPropagation();
    if (isLiking) return;
    
    setIsLiking(true);
    
    const newEngagement = {
      ...post.engagement,
      likes: (post.engagement?.likes || 0) + 1,
      total: (post.engagement?.total || 0) + 1
    };
    
    dispatch(updateEngagementLocal({ 
      id: post.id, 
      engagement: newEngagement 
    }));
    
    try {
      await dispatch(updateEngagement({ 
        postId: post.id, 
        type: 'likes'
      })).unwrap();
      
      dispatch(addNotification({ 
        type: 'success', 
        message: '❤️ Liked!',
        duration: 1500
      }));
    } catch (error) {
      dispatch(updateEngagementLocal({ 
        id: post.id, 
        engagement: post.engagement 
      }));
      dispatch(addNotification({ 
        type: 'error', 
        message: 'Failed to like post' 
      }));
    } finally {
      setIsLiking(false);
    }
  }, [dispatch, post, isLiking]);

  // Handle Comment
  const handleCommentClick = useCallback((e) => {
    e.stopPropagation();
    setShowCommentDialog(true);
  }, []);

  const handleCommentSubmit = useCallback(async (commentText) => {
    const newEngagement = {
      ...post.engagement,
      comments: (post.engagement?.comments || 0) + 1,
      total: (post.engagement?.total || 0) + 1
    };
    
    dispatch(updateEngagementLocal({ 
      id: post.id, 
      engagement: newEngagement 
    }));
    
    try {
      await dispatch(updateEngagement({ 
        postId: post.id, 
        type: 'comments'
      })).unwrap();
      
      dispatch(addNotification({ 
        type: 'success', 
        message: `💬 Comment posted!`,
        duration: 2000
      }));
      
      console.log('Comment posted:', commentText);
      
    } catch (error) {
      dispatch(updateEngagementLocal({ 
        id: post.id, 
        engagement: post.engagement 
      }));
      dispatch(addNotification({ 
        type: 'error', 
        message: 'Failed to post comment' 
      }));
    }
  }, [dispatch, post]);

  // Handle Share
  const handleShareClick = useCallback((e) => {
    e.stopPropagation();
    setShowShareOptions(true);
  }, []);

  const handleShareSubmit = useCallback(async (platform) => {
    const newEngagement = {
      ...post.engagement,
      shares: (post.engagement?.shares || 0) + 1,
      total: (post.engagement?.total || 0) + 1
    };
    
    dispatch(updateEngagementLocal({ 
      id: post.id, 
      engagement: newEngagement 
    }));
    
    try {
      await dispatch(updateEngagement({ 
        postId: post.id, 
        type: 'shares'
      })).unwrap();
      
      const shareData = {
        title: post.title,
        text: post.content?.substring(0, 200),
        url: window.location.href
      };
      
      let shareUrl = '';
      switch (platform) {
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.title)}&url=${encodeURIComponent(shareData.url)}`;
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}&quote=${encodeURIComponent(shareData.title)}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`;
          break;
        case 'whatsapp':
          shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareData.title + ' ' + shareData.url)}`;
          break;
        case 'telegram':
          shareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.title)}`;
          break;
        case 'instagram':
          shareUrl = null;
          break;
        case 'copy':
          await navigator.clipboard.writeText(`${shareData.title}\n${shareData.url}`);
          dispatch(addNotification({ type: 'success', message: '📋 Link copied to clipboard!' }));
          return;
        default:
          break;
      }
      
      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=600');
      } else if (platform === 'instagram') {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.url}`);
        dispatch(addNotification({ type: 'success', message: '📋 Content copied! Share on Instagram manually.' }));
      }
      
      dispatch(addNotification({ 
        type: 'success', 
        message: `🔄 Shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`,
        duration: 2000
      }));
      
    } catch (error) {
      dispatch(updateEngagementLocal({ 
        id: post.id, 
        engagement: post.engagement 
      }));
      dispatch(addNotification({ 
        type: 'error', 
        message: `Failed to share on ${platform}` 
      }));
    }
  }, [dispatch, post]);

  const formattedDate = useMemo(() => {
    if (!post?.createdAt) return '';
    return new Date(post.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, [post?.createdAt]);

  const engagement = useMemo(() => {
    if (!post?.engagement) return { likes: 0, comments: 0, shares: 0, total: 0 };
    return post.engagement;
  }, [post?.engagement]);

  if (!post) return null;

  return (
    <>
      <div 
        onClick={handleSelect}
        style={{
          border: `2px solid ${isSelected ? platform?.color || '#1976d2' : '#e0e0e0'}`,
          padding: '16px',
          margin: '12px 0',
          borderRadius: '10px',
          cursor: 'pointer',
          backgroundColor: isSelected ? '#f0f7ff' : 'white',
          transition: 'all 0.3s ease',
          boxShadow: isSelected ? '0 4px 12px rgba(25, 118, 210, 0.15)' : '0 2px 4px rgba(0,0,0,0.05)',
          position: 'relative'
        }}
      >
        {post.status === 'draft' && (
          <span style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: '#ff9800',
            color: 'white',
            padding: '2px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 'bold'
          }}>
            📝 Draft
          </span>
        )}
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '8px'
        }}>
          <h3 style={{ margin: '0', color: '#333', fontSize: '18px', flex: 1 }}>
            {post.title}
          </h3>
          <span style={{
            backgroundColor: platform?.color || '#1976d2',
            color: 'white',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
            marginLeft: '10px',
            whiteSpace: 'nowrap'
          }}>
            {platform?.icon || '📱'} {platform?.name || 'Unknown'}
          </span>
        </div>
        
        <p style={{ 
          margin: '10px 0', 
          color: '#555', 
          lineHeight: '1.6',
          fontSize: '14px'
        }}>
          {post.content?.substring(0, 180)}
          {post.content?.length > 180 && '...'}
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '18px', 
          fontSize: '13px', 
          color: '#777',
          marginBottom: '12px',
          flexWrap: 'wrap'
        }}>
          <span>✍️ {post.author || 'Unknown'}</span>
          <span>📅 {formattedDate}</span>
          {post.tags && post.tags.length > 0 && (
            <span>🏷️ {post.tags.join(', ')}</span>
          )}
        </div>
        
        {/* Engagement Section */}
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          padding: '10px 0',
          borderTop: '1px solid #f0f0f0',
          borderBottom: '1px solid #f0f0f0',
          marginBottom: '12px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleLike}
            disabled={isLiking}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              cursor: isLiking ? 'not-allowed' : 'pointer',
              padding: '6px 12px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              opacity: isLiking ? 0.6 : 1,
              fontSize: '14px',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              if (!isLiking) e.target.style.backgroundColor = '#ffebee';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '18px' }}>{isLiking ? '⏳' : '❤️'}</span>
            <span style={{ fontWeight: 'bold', color: '#e91e63' }}>{engagement.likes}</span>
            <span style={{ color: '#777', fontSize: '12px' }}>Likes</span>
          </button>

          <button
            onClick={handleCommentClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              fontSize: '14px',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e8f5e9'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <span style={{ fontSize: '18px' }}>💬</span>
            <span style={{ fontWeight: 'bold', color: '#4caf50' }}>{engagement.comments}</span>
            <span style={{ color: '#777', fontSize: '12px' }}>Comments</span>
          </button>

          <button
            onClick={handleShareClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              fontSize: '14px',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e3f2fd'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <span style={{ fontSize: '18px' }}>🔄</span>
            <span style={{ fontWeight: 'bold', color: '#2196f3' }}>{engagement.shares}</span>
            <span style={{ color: '#777', fontSize: '12px' }}>Shares</span>
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            marginLeft: 'auto',
            backgroundColor: '#f5f5f5',
            padding: '4px 14px',
            borderRadius: '20px',
            border: '1px solid #e0e0e0'
          }}>
            <span style={{ fontSize: '16px' }}>📊</span>
            <span style={{ fontWeight: 'bold', color: '#ff9800' }}>{engagement.total}</span>
            <span style={{ color: '#777', fontSize: '12px' }}>Total</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button 
            onClick={handleEdit}
            style={{
              padding: '6px 20px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#388e3c'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#4caf50'}
          >
            ✏️ Edit
          </button>
          <button 
            onClick={handleDelete}
            style={{
              padding: '6px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#c62828'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f44336'}
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {showCommentDialog && (
        <CommentDialog
          post={post}
          onClose={() => setShowCommentDialog(false)}
          onSubmit={handleCommentSubmit}
        />
      )}

      {showShareOptions && (
        <ShareOptions
          post={post}
          onClose={() => setShowShareOptions(false)}
          onShare={handleShareSubmit}
        />
      )}
    </>
  );
});

PostItem.displayName = 'PostItem';
export default PostItem;