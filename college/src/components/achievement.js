import React, { useState } from 'react';

const PostAchievementPage = ({ onNavigateBack, onSubmitAchievement }) => {
  const [formData, setFormData] = useState({
    title: '',
    certification: '',
    place: '',
    date: '',
    description: '',
    photo: '🏆', // Default emoji
    category: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Achievement categories
  const categories = [
    { value: 'academic', label: 'Academic Excellence', icon: '🎓' },
    { value: 'sports', label: 'Sports & Athletics', icon: '🏅' },
    { value: 'technology', label: 'Technology & Innovation', icon: '💻' },
    { value: 'research', label: 'Research & Publication', icon: '📄' },
    { value: 'leadership', label: 'Leadership & Management', icon: '👑' },
    { value: 'community', label: 'Community Service', icon: '🤝' },
    { value: 'arts', label: 'Arts & Culture', icon: '🎨' },
    { value: 'entrepreneurship', label: 'Entrepreneurship', icon: '💡' }
  ];

  // Photo options based on category
  const photoOptions = {
    academic: ['🎓', '📚', '🏆', '🥇', '📜'],
    sports: ['🏅', '🥇', '🥈', '🥉', '🏆', '⚽', '🏀', '🎾'],
    technology: ['💻', '🖥️', '📱', '🔧', '⚙️', '🤖', '💾'],
    research: ['📄', '📊', '🔬', '📝', '📋', '🧪', '📈'],
    leadership: ['👑', '🏆', '📈', '🎯', '💼', '🌟'],
    community: ['🤝', '❤️', '🌍', '🏠', '👥', '🎗️'],
    arts: ['🎨', '🎭', '🎵', '🎪', '🖼️', '🎬', '📸'],
    entrepreneurship: ['💡', '🚀', '💼', '📈', '🏢', '💰']
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Auto-update photo based on category
    if (name === 'category' && value) {
      const categoryPhotos = photoOptions[value] || ['🏆'];
      setFormData(prev => ({
        ...prev,
        photo: categoryPhotos[0]
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Achievement title is required';
    }
    if (!formData.certification.trim()) {
      newErrors.certification = 'Certification details are required';
    }
    if (!formData.place.trim()) {
      newErrors.place = 'Location/Place is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.date = 'Date cannot be in the future';
      }
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      if (onSubmitAchievement) {
        await onSubmitAchievement(formData);
      }
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    if (validateForm()) {
      setShowPreview(true);
    }
  };

  const renderPreview = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '30px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#1f2937' }}>Achievement Preview</h3>
          <button
            onClick={() => setShowPreview(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ✕
          </button>
        </div>
        
        {/* Preview Card */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{
              fontSize: '2.5rem',
              marginRight: '16px',
              padding: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '60px',
              height: '60px'
            }}>
              {formData.photo}
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '1.2rem' }}>
                {formData.title}
              </h4>
              <span style={{
                background: '#10b981',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.7rem'
              }}>
                {new Date(formData.date).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#374151' }}>🏅 Certification:</strong>
            <p style={{ margin: '4px 0', color: '#6b7280' }}>{formData.certification}</p>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#374151' }}>📍 Location:</strong>
            <p style={{ margin: '4px 0', color: '#6b7280' }}>{formData.place}</p>
          </div>
          
          <div>
            <strong style={{ color: '#374151' }}>📝 Description:</strong>
            <p style={{ margin: '4px 0', color: '#6b7280', fontStyle: 'italic' }}>
              {formData.description}
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button
            onClick={() => setShowPreview(false)}
            style={{
              flex: 1,
              background: '#6b7280',
              color: '#fff',
              border: 'none',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Edit
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              flex: 1,
              background: '#10b981',
              color: '#fff',
              border: 'none',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {isSubmitting ? 'Posting...' : 'Post Achievement'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <header style={{
        background: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '16px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
          <button
            onClick={onNavigateBack}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              marginRight: '16px',
              color: '#6366f1'
            }}
          >
            ← Back
          </button>
          <h1 style={{ margin: 0, color: '#1f2937', fontSize: '1.5rem' }}>Post New Achievement</h1>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎉</div>
              <h2 style={{ color: '#1f2937', marginBottom: '8px' }}>Share Your Achievement</h2>
              <p style={{ color: '#6b7280' }}>
                Tell the world about your accomplishment and inspire others!
              </p>
            </div>

            <div onSubmit={handleSubmit}>
              {/* Category Selection */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Achievement Category *
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px'
                }}>
                  {categories.map((cat) => (
                    <label
                      key={cat.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        border: `2px solid ${formData.category === cat.value ? '#6366f1' : '#e5e7eb'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: formData.category === cat.value ? '#f0f4ff' : '#fff',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat.value}
                        checked={formData.category === cat.value}
                        onChange={handleInputChange}
                        style={{ display: 'none' }}
                      />
                      <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>{cat.icon}</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{cat.label}</span>
                    </label>
                  ))}
                </div>
                {errors.category && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Achievement Title */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Achievement Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., First Prize in National Coding Competition"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${errors.title ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = errors.title ? '#ef4444' : '#e5e7eb'}
                />
                {errors.title && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Photo Selection */}
              {formData.category && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Choose Photo/Icon
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {photoOptions[formData.category]?.map((photo, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, photo }))}
                        style={{
                          background: formData.photo === photo ? '#6366f1' : '#f3f4f6',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px',
                          fontSize: '1.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {photo}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Certification Details */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Certification/Award Details *
                </label>
                <input
                  type="text"
                  name="certification"
                  value={formData.certification}
                  onChange={handleInputChange}
                  placeholder="e.g., Gold Medal - Computer Science Excellence"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${errors.certification ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = errors.certification ? '#ef4444' : '#e5e7eb'}
                />
                {errors.certification && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>
                    {errors.certification}
                  </p>
                )}
              </div>

              {/* Location/Place */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Location/Place *
                </label>
                <input
                  type="text"
                  name="place"
                  value={formData.place}
                  onChange={handleInputChange}
                  placeholder="e.g., Tech University Auditorium, Mumbai"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${errors.place ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = errors.place ? '#ef4444' : '#e5e7eb'}
                />
                {errors.place && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>
                    {errors.place}
                  </p>
                )}
              </div>

              {/* Date */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Date of Achievement *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${errors.date ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = errors.date ? '#ef4444' : '#e5e7eb'}
                />
                {errors.date && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>
                    {errors.date}
                  </p>
                )}
              </div>

              {/* Description */}
              <div style={{ marginBottom: '32px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your achievement, the challenges you overcame, and what it means to you..."
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${errors.description ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    resize: 'vertical',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = errors.description ? '#ef4444' : '#e5e7eb'}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  {errors.description && (
                    <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: 0 }}>
                      {errors.description}
                    </p>
                  )}
                  <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: 0, marginLeft: 'auto' }}>
                    {formData.description.length}/500 characters
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  type="button"
                  onClick={handlePreview}
                  style={{
                    flex: 1,
                    background: '#6b7280',
                    color: '#fff',
                    border: 'none',
                    padding: '14px 24px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#4b5563'}
                  onMouseLeave={(e) => e.target.style.background = '#6b7280'}
                >
                  Preview
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    flex: 2,
                    background: isSubmitting ? '#9ca3af' : '#6366f1',
                    color: '#fff',
                    border: 'none',
                    padding: '14px 24px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) e.target.style.background = '#4f46e5';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) e.target.style.background = '#6366f1';
                  }}
                >
                  {isSubmitting ? 'Posting Achievement...' : 'Post Achievement 🎉'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      {showPreview && renderPreview()}
    </div>
  );
};

export default PostAchievementPage;