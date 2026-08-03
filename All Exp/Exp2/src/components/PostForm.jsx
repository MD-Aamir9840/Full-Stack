import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, updatePost, fetchPosts } from '../store/slices/postsSlice';
import { hideModal, addNotification } from '../store/slices/uiSlice';
import { selectAllPlatforms } from '../store/slices/platformsSlice';
import { selectPostById } from '../store/slices/postsSlice';

const PostForm = React.memo(() => {
  const dispatch = useDispatch();
  const platforms = useSelector(selectAllPlatforms);
  const selectedPostId = useSelector(state => state.posts.selectedPostId);
  const modals = useSelector(state => state.ui.modals);
  
  // Get the post to edit
  const editPost = useSelector(state => selectPostById(state, selectedPostId));
  const isEditMode = !!editPost && modals.editPost;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    platformId: '',
    tags: [],
    status: 'published'
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!modals.createPost && !modals.editPost) {
      resetForm();
    }
  }, [modals.createPost, modals.editPost]);

  // Load edit data when editing
  useEffect(() => {
    if (isEditMode && editPost) {
      setFormData({
        title: editPost.title || '',
        content: editPost.content || '',
        author: editPost.author || '',
        platformId: editPost.platformId || '',
        tags: editPost.tags || [],
        status: editPost.status || 'published'
      });
    }
  }, [isEditMode, editPost]);

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      content: '',
      author: '',
      platformId: '',
      tags: [],
      status: 'published'
    });
    setTagInput('');
    setIsSubmitting(false);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  }, [tagInput, formData.tags]);

  const handleRemoveTag = useCallback((tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }, []);

  const closeModal = useCallback(() => {
    const modalName = isEditMode ? 'editPost' : 'createPost';
    dispatch(hideModal(modalName));
    resetForm();
  }, [dispatch, isEditMode, resetForm]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      dispatch(addNotification({ type: 'error', message: 'Title is required' }));
      return;
    }
    if (!formData.content.trim()) {
      dispatch(addNotification({ type: 'error', message: 'Content is required' }));
      return;
    }
    if (!formData.platformId) {
      dispatch(addNotification({ type: 'error', message: 'Please select a platform' }));
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        // UPDATE EXISTING POST
        const result = await dispatch(updatePost({ 
          id: editPost.id, 
          updates: formData 
        })).unwrap();
        
        dispatch(addNotification({ 
          type: 'success', 
          message: '✅ Post updated successfully!' 
        }));
        console.log('Updated post:', result);
      } else {
        // CREATE NEW POST
        const result = await dispatch(createPost(formData)).unwrap();
        dispatch(addNotification({ 
          type: 'success', 
          message: '✅ Post created successfully!' 
        }));
        console.log('Created post:', result);
      }
      
      // Refresh the posts list
      await dispatch(fetchPosts());
      
      // Close modal and reset form
      const modalName = isEditMode ? 'editPost' : 'createPost';
      dispatch(hideModal(modalName));
      resetForm();
      
    } catch (error) {
      dispatch(addNotification({ 
        type: 'error', 
        message: error || 'Failed to save post' 
      }));
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isEditMode, editPost, dispatch, resetForm]);

  const platformsList = useMemo(() => {
    return platforms.map(platform => (
      <option key={platform.id} value={platform.id}>
        {platform.icon} {platform.name}
      </option>
    ));
  }, [platforms]);

  // Don't render if modal is not open
  if (!modals.createPost && !modals.editPost) {
    return null;
  }

  if (platforms.length === 0) {
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
        zIndex: 9999
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          textAlign: 'center'
        }}>
          <p>Loading platforms...</p>
        </div>
      </div>
    );
  }

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
      zIndex: 9999,
      animation: 'fadeIn 0.2s ease'
    }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        animation: 'fadeIn 0.2s ease'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#1976d2' }}>
          {isEditMode ? '✏️ Edit Post' : '📝 Create New Post'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#555' }}>
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1976d2'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#555' }}>
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content..."
              rows="4"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1976d2'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#555' }}>
              Author *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1976d2'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#555' }}>
              Platform *
            </label>
            <select
              name="platformId"
              value={formData.platformId}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'white',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1976d2'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            >
              <option value="">Select a platform</option>
              {platformsList}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#555' }}>
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'white',
                transition: 'border-color 0.2s'
              }}
            >
              <option value="published">✅ Published</option>
              <option value="draft">📝 Draft</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#555' }}>
              Tags
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddTag}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Add
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#1976d2',
                      padding: '0',
                      fontSize: '14px'
                    }}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            marginTop: '20px',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={closeModal}
              style={{
                padding: '10px 24px',
                backgroundColor: '#f5f5f5',
                color: '#555',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e0e0e0'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f5f5f5'}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '10px 24px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) e.target.style.backgroundColor = '#1565c0';
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) e.target.style.backgroundColor = '#1976d2';
              }}
            >
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

PostForm.displayName = 'PostForm';
export default PostForm;