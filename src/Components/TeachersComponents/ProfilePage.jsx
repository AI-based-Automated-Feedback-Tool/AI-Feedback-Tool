import React, { useState, useEffect } from 'react';
import { Card, Container, Spinner, Alert, Button, Form } from 'react-bootstrap';
import { supabase } from '../../SupabaseAuth/supabaseClient';
import '../../css/pages/ProfilePage.css';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('User not authenticated');
        
        const { data, error } = await supabase
          .from('users')
          .select('name, email, role')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setUserData(data);
        setNewName(data.name); // Initialize the editable name
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateName = async () => {
    try {
      setUpdateLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      // Update in users table
      const { error } = await supabase
        .from('users')
        .update({ name: newName })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setUserData(prev => ({ ...prev, name: newName }));
      setIsEditing(false);
      
    } catch (err) {
      console.error('Error updating name:', err);
      setError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading-container">
        <div className="profile-loading-spinner"></div>
        <div className="profile-loading-text">Loading Profile</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-content-container">
          <Container>
            <Alert className="profile-error-alert">
              <strong>⚠️ Error Loading Profile</strong><br />
              {error}
            </Alert>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Hero Section */}
      <div className="profile-hero-section">
        <Container>
          <div className="profile-hero-content">
            <h1 className="profile-hero-title">
              👤 Teacher Profile
            </h1>
            <p className="profile-hero-subtitle">
              Manage your account information and preferences
            </p>
          </div>
        </Container>
      </div>

      <div className="profile-content-container">
        <Container>
          <Card className="profile-main-card">
            <Card.Body className="profile-card-body">
              {userData && (
                <>
                  {/* Avatar Section */}
                  <div className="profile-avatar-section">
                    <div className="profile-avatar">
                      <span className="profile-avatar-letter">
                        {userData.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Profile Information */}
                  <div className="profile-info-section">
                    {isEditing ? (
                      <div className="profile-form-section">
                        <Form>
                          <div className="profile-form-group">
                            <label className="profile-form-label">Full Name</label>
                            <input
                              type="text"
                              className="profile-form-control"
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              disabled={updateLoading}
                              placeholder="Enter your full name"
                            />
                          </div>
                          
                          <div className="profile-form-group">
                            <label className="profile-form-label">Email Address</label>
                            <input
                              type="email"
                              className="profile-form-control"
                              value={userData.email}
                              disabled
                              readOnly
                            />
                            <small className="text-muted">Email cannot be changed</small>
                          </div>
                          
                          <div className="profile-form-group">
                            <label className="profile-form-label">Role</label>
                            <input
                              type="text"
                              className="profile-form-control"
                              value={userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                              disabled
                              readOnly
                            />
                          </div>
                          
                          <div className="profile-form-actions">
                            <button 
                              type="button"
                              className="profile-save-btn"
                              onClick={handleUpdateName}
                              disabled={updateLoading || !newName.trim()}
                            >
                              {updateLoading ? (
                                <>
                                  <Spinner animation="border" size="sm" className="me-2" />
                                  Saving...
                                </>
                              ) : (
                                <>💾 Save Changes</>
                              )}
                            </button>
                            
                            <button 
                              type="button"
                              className="profile-cancel-btn"
                              onClick={() => {
                                setIsEditing(false);
                                setNewName(userData.name);
                              }}
                              disabled={updateLoading}
                            >
                              ❌ Cancel
                            </button>
                          </div>
                        </Form>
                      </div>
                    ) : (
                      <>
                        <h2 className="profile-name">{userData.name}</h2>
                        <p className="profile-email">{userData.email}</p>
                        <div className="profile-role">
                          🎓 {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                        </div>
                        
                        <div className="profile-actions">
                          <button 
                            className="profile-edit-btn"
                            onClick={() => setIsEditing(true)}
                          >
                            ✏️ Edit Profile
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default ProfilePage;