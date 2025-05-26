import { useState } from 'react';
import { useEffect } from 'react';
import { supabase } from '../../SupabaseAuth/supabaseClient';
import { Row, Col, CardHeader, CardBody, Card, Button, Alert } from 'react-bootstrap';
import CourseDropdown from './CourseDropdown';
import StudentDropdown from './StudentDropdown';
import ExamDropdown from './ExamDropdown'; 
import LoadingCard from './LoadingCard';

export default function TeacherReportContent() {
    const [selectedCourse, setSelectedCourse] = useState("");
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [selectedExam, setSelectedExam] = useState("");
    const [selectedStudent, setSelectedStudent] = useState("");
    const [loadingUser, setLoadingUser] = useState(true);

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

    // Prevent rendering anything dependent on userId until it's loaded
    if (loadingUser) {
         return (
            <Col className="w-100" style={{ backgroundColor: '#f8f9fa' }}>
                <LoadingCard />
            </Col>
        );
    }

  return (
    <Col 
        className="w-100 " 
        style={{ backgroundColor: '#f8f9fa' }}
    >
        <Card className="mt-4">
            <CardHeader className='bg-primary text-white '>
                <h4>📋 Teacher Report</h4>
            </CardHeader>
            <CardBody>
                <Card className="mb-4 border-0 shadow-sm">
                    <CardHeader>
                        <h5 className="mb-0">Search Criteria</h5>
                    </CardHeader>
                    <CardBody>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Row className="mb-2 mb-md-3">
                            <Col md={6}>
                                <CourseDropdown 
                                    selectedCourse={selectedCourse} 
                                    setSelectedCourse={setSelectedCourse} 
                                    userId={userId} 
                                    setError={setError}
                                />
                            </Col>

                            <Col md={6}>
                                <ExamDropdown 
                                    selectedCourse={selectedCourse} 
                                    selectedExam={selectedExam} 
                                    setSelectedExam={setSelectedExam} 
                                    setError={setError}
                                />
                            </Col>
                        </Row>

                        <Row className='mb-2 mb-md-3'>
                            <Col md={6}>
                                <StudentDropdown 
                                    selectedCourse={selectedCourse} 
                                    selectedStudent={selectedStudent} 
                                    setSelectedStudent={setSelectedStudent} 
                                    setError={setError}
                                />
                            </Col>

                        </Row>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="mt-2 mt-md-3"
                        >
                            Generate Report
                        </Button>
                    </CardBody>
                </Card>

                <Card className="mb-4 border-0 shadow-sm">
                    <CardBody>
                        {/*Here shows the text which says no contents to preview */}
                        <Alert variant="info">
                            <p className="mb-0">
                                No report available to preview. Please select the criteria and generate a report.
                            </p>
                        </Alert>
                    </CardBody>

                </Card>

            </CardBody>
        </Card>
    </Col>
  )
}
