import { useState } from 'react';
import { useEffect } from 'react';
import { supabase } from '../../SupabaseAuth/supabaseClient';
import { Row, Col, CardHeader, CardBody, Card, Button, Alert } from 'react-bootstrap';
import CourseDropdown from './CourseDropdown';
import StudentDropdown from './StudentDropdown';
import ExamDropdown from './ExamDropdown'; 
import LoadingCard from './LoadingCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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

    //placeholder score deatils
    const scoreDistributionData = [
        { scoreRange: '0-40', students: 8 },
        { scoreRange: '41-50', students: 22 },
        { scoreRange: '51-60', students: 45 },
        { scoreRange: '61-70', students: 70 },
        { scoreRange: '71-80', students: 50 },
        { scoreRange: '81-90', students: 18 },
        { scoreRange: '91-100', students: 4 },
    ];

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
                    <CardHeader className="bg-white">
                        <h5 >
                            📊 Overall Exam Report 
                        </h5>
                    </CardHeader>
                    <CardBody>
                        <Row className="mb-4">
                            {[
                                {
                                    title: "Total Students Attempted",
                                    value: "48 / 55",
                                },
                                {
                                    title: "Average Score",
                                    value: "72%",
                                },
                                {
                                    title: "Highest Score",
                                    value: "98%",
                                }
                            ].map((stat, index) => (
                                <Col md={4} key={index}>
                                    <Card className="text-center border-0 shadow-sm bg-light">
                                        <CardBody>
                                            <p className="text-muted mb-1">{stat.title}</p>
                                            <h3 className="fw-bold text-primary">{stat.value}</h3>
                                        </CardBody>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </CardBody>
                    <hr style={{
                        border: 'none',
                        height: '2px',
                        width: '95%',
                        backgroundColor: '#dee2e6',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        borderRadius: '4px',
                        margin: '2rem auto'
                    }} />
                    <CardBody>
                        <h6 className="mb-3">📈 Score Distribution</h6>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={scoreDistributionData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="scoreRange" label={{ value: 'Score Range', position: 'insideBottom', offset: -5 }} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="students" fill="#0d6efd" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardBody>
                    <hr style={{
                        border: 'none',
                        height: '2px',
                        width: '95%',
                        backgroundColor: '#dee2e6',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        borderRadius: '4px',
                        margin: '2rem auto'
                    }} />
                    <CardBody>
                        <h6>Performance Analysis</h6>
                        <Row>
                            <Col md={6}>
                                <Card className="text-center border-0 shadow-sm bg-light">
                                    <CardBody>
                                        <p className="text-muted mb-1">Average time taken</p>
                                        <h3 className="fw-bold text-primary">45 min</h3>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="text-center border-0 shadow-sm bg-light">
                                    <CardBody>
                                        <p className="text-muted mb-1">Average focus loss per student</p>
                                        <h3 className="fw-bold text-primary">1.9</h3>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </CardBody>
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
