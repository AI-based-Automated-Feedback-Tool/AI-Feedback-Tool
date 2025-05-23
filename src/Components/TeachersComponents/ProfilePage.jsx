import React, { useState, useEffect } from 'react';
import { Card, Container, Spinner, Alert, Button } from 'react-bootstrap';
import { supabase } from '../../SupabaseAuth/supabaseClient';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error loading profile</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h4>👤 Teacher Profile</h4>
          <Button 
            variant="light" 
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Name'}
          </Button>
        </Card.Header>
        <Card.Body>
          {userData && (
            <div className="profile-details">
              <div className="mb-4">
                <div className="profile-avatar d-flex justify-content-center mb-4">
                  <div 
                    className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" 
                    style={{ 
                      width: '100px', 
                      height: '100px', 
                      fontSize: '3rem',
                      backgroundColor: '#4e73df' // More professional color
                    }}
                  >
                    {userData.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                
                <div className="profile-info" style={{ maxWidth: '500px', margin: '0 auto' }}>
                  {isEditing ? (
                    <div className="mb-4">
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input 
                          type="text" 
                          className="form-control form-control-lg"
                          defaultValue={userData.name}
                        />
                      </div>
                      <Button variant="primary" className="me-2">
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="text-center mb-4">
                        <h3 className="mb-1" style={{ fontWeight: '600' }}>{userData.name}</h3>
                        <p className="text-muted mb-0" style={{ fontSize: '1.2rem' }}>{userData.email}</p>
                      </div>
                      
                      <div className="d-flex justify-content-center mt-4">
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
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;