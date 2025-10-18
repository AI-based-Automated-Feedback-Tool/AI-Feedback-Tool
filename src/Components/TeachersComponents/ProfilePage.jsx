import React, { useState, useEffect } from 'react';
import { Card, Container, Spinner, Alert, Button, Form } from 'react-bootstrap';
import { supabase } from '../../SupabaseAuth/supabaseClient';
import './ProfilePage.css';

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

                <div className="profile-info" style={{ maxWidth: '500px', margin: '0 auto' }}>
                    {isEditing ? (
                        <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                              type="text"
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              disabled={updateLoading}
                            />
                      </Form.Group>
                          
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                              type="email"
                              value={userData.email}
                              disabled
                              readOnly
                            />
                      </Form.Group>
                          
                      <div className="d-flex gap-2">
                        <Button 
                          variant="primary" 
                              onClick={handleUpdateName}
                              disabled={updateLoading || !newName.trim()}
                            >
                              {updateLoading ? (
                                <>
                                  <Spinner animation="border" size="sm" className="me-2" />
                                  Saving...
                                </>
                          ) : 'Save Changes'}
                        </Button>
                            
                        <Button 
                          variant="outline-secondary" 
                              onClick={() => {
                                setIsEditing(false);
                            setNewName(userData.name); // Reset to original name
                              }}
                              disabled={updateLoading}
                            >
                          Cancel
                        </Button>
                      </div>
                    </Form>
                    ) : (
                      <>
                      <div className="text-center mb-4">
                        <h3 className="mb-1" style={{ fontWeight: '600' }}>{userData.name}</h3>
                        <p className="text-muted mb-0" style={{ fontSize: '1.2rem' }}>{userData.email}</p>
                        </div>
                        
                      <div className="d-flex justify-content-center">
                        <Button 
                          variant="outline-primary"
                            onClick={() => setIsEditing(true)}
                          >
                          Edit Profile
                        </Button>
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