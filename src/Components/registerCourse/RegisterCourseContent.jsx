import { Card, CardBody, CardHeader, Col } from 'react-bootstrap';
import LoadingCard from '../TeacherReport/components/LoadingCard';
import { useEffect, useState } from 'react';
import { supabase } from '../../SupabaseAuth/supabaseClient';
import CreateCourseForm from './components/CreateCourseForm';


export default function RegisterCourseContent() {
    const [userId, setUserId] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
                const getUserId = async () => {
                    setLoadingUser(true);
                    const { data, error } = await supabase.auth.getUser();
                    if (error || !data?.user?.id) {
                        setError("Failed to get user ID");
                    } else {
                        setUserId(data.user.id);
                    }
                    setLoadingUser(false);
                }
                getUserId();
            }, []);
  return (
    <Col
        className="w-100 "
        style={{ backgroundColor: '#f8f9fa' }}
    >
        {loadingUser ? (
            <LoadingCard />
        ) :(<>
            <Card className="mt-4">
                <CardHeader className='bg-primary text-white '>
                    <h4>📋 Register course</h4>
                </CardHeader>
                <Card.Body>
                    <CreateCourseForm />
                </Card.Body>
            </Card>
        </>)}
    </Col>
  )
}
