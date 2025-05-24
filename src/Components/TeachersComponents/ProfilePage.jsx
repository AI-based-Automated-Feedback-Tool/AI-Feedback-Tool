import React, { useState, useEffect } from 'react';
import { Card, Container, Spinner, Alert, Button, Form } from 'react-bootstrap';
import { supabase } from '../../SupabaseAuth/supabaseClient';

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
          {!isEditing && (
            <Button 
              variant="light" 
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </Card.Header>
        <Card.Body>
          {userData && (
            <div className="profile-details">
              <div className="mb-4">
                <div className="profile-avatar d-flex justify-content-center mb-4">
                  <div 
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" 
                    style={{ 
                      width: '100px', 
                      height: '100px', 
                      fontSize: '3rem'
                    }}
                  >
                    {userData.name.charAt(0).toUpperCase()}
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
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;