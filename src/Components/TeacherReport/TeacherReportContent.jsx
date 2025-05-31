import { useState } from 'react';
import { useEffect } from 'react';
import { supabase } from '../../SupabaseAuth/supabaseClient';
import { Row, Col, CardHeader, CardBody, Card, Button, Alert } from 'react-bootstrap';
import CourseDropdown from './CourseDropdown';
import StudentDropdown from './StudentDropdown';
import ExamDropdown from './ExamDropdown'; 
import LoadingCard from './LoadingCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import robot from '../../assets/robot.png'
import useFetchExamSubmissions from './hooks/useFetchExamSubmissions';

export default function TeacherReportContent() {
    const [selectedCourse, setSelectedCourse] = useState("");
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [selectedExam, setSelectedExam] = useState("");
    const [selectedStudent, setSelectedStudent] = useState("");
    const [loadingUser, setLoadingUser] = useState(true);

    const [loadingReport, setLoadingReport] = useState(false)
    const [reportData, setReportData] = useState(false)
    const [reportError, setReportError] = useState()

    const { examSubmissions, loading } = useFetchExamSubmissions(selectedExam, setReportError);
    const [reportRequested, setReportRequested] = useState(false);


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

    // Reset report on course or exam change
    useEffect(() => {
        setReportData(false);
        setReportError(null);
        setReportRequested(false);
    }, [selectedCourse, selectedExam]);

    // Show report when data is fetched
    useEffect(() => {
        if (!loading && selectedExam && reportRequested) {
            setReportData(true);
            setLoadingReport(false);
        }
    }, [loading, selectedExam, reportRequested]);

    const generateReport = async () =>{
        if(!selectedCourse || !selectedExam) {
            setError('Please select both course and exam')
            return
        }

        setLoadingReport(true)
        setError(null)
        setReportRequested(true)
    }

    //report content
    const noOfStudentsDoneExam = examSubmissions.length;
    const scores = examSubmissions.map((submission) => submission.total_score)
    let totalScore = 0;
    for(let i=0; i<scores.length; i++){
        totalScore = totalScore+scores[i]
    }
    const avgScore = noOfStudentsDoneExam > 0 ? (totalScore / noOfStudentsDoneExam).toFixed(2) : 0;
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;

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
                                onClick={generateReport}
                                disabled={loadingReport}
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
                        {reportData ? (
                            <>
                                <CardBody>
                                    <Row className="mb-4 mt-4">
                                        <Col md={4}>
                                            <Card className="text-center border-0 shadow-sm bg-light">
                                                <CardBody>
                                                    <p className="text-muted mb-1">Total Students Attempted</p>
                                                    <h3 className="fw-bold text-primary">{noOfStudentsDoneExam}</h3>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col md={4}>
                                            <Card className="text-center border-0 shadow-sm bg-light">
                                                <CardBody>
                                                    <p className="text-muted mb-1">Average Score</p>
                                                    <h3 className="fw-bold text-primary">{avgScore}</h3>
                                                </CardBody>
                                            </Card>
                                        </Col> 
                                        <Col md={4}>
                                            <Card className="text-center border-0 shadow-sm bg-light">
                                                <CardBody>
                                                    <p className="text-muted mb-1">Highest Score</p>
                                                    <h3 className="fw-bold text-primary">{highestScore}</h3>
                                                </CardBody>
                                            </Card>
                                        </Col> 
                                                        
                                    </Row>
                                </CardBody>
                                <hr style={{
                                    border: 'none',
                                    height: '2px',
                                    width: '95%',
                                    backgroundColor: '#dee2e6',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '4px',
                                    margin: '1rem auto'
                                }} />
                                <CardBody>
                                    <h5 className="mb-4">📈 Score Distribution</h5>
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
                                    margin: '1rem auto'
                                }} />
                                <CardBody>
                                    <h5 className='mb-4'>📉 Performance Analysis</h5>
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
                                <hr style={{
                                    border: 'none',
                                    height: '2px',
                                    width: '95%',
                                    backgroundColor: '#dee2e6',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '4px',
                                    margin: '1rem auto'
                                }} />
                                                                             
                                <CardBody>
                                    <Row className="mb-3 justify-content-center">
                                        <Col 
                                            xs={6} sm={6} md={3}
                                            className="text-center text-sm-start"
                                        >                
                                            <img 
                                                src={robot} 
                                                alt="AI Analysis" 
                                                style={{ 
                                                    maxWidth: '100%', 
                                                    height: 'auto'
                                                }} 
                                            />
                                        </Col>
                                        <Col md={9}>
                                            <h5 className='mb-4'>AI Insights</h5>
                                            <p className="text-muted">
                                                Based on the score distribution, it appears that the majority of students scored between <strong>61–70</strong>. This suggests a strong central tendency, with room for improvement in higher ranges. Consider reviewing topics around the 70–80 mark to boost top-tier performance.
                                            </p>        
                                        </Col>
                                    </Row>
                                </CardBody>
                                <hr style={{
                                    border: 'none',
                                    height: '2px',
                                    width: '95%',
                                    backgroundColor: '#dee2e6',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '4px',
                                    margin: '1rem auto'
                                }} />
                                <CardBody>
                                    <Row>
                                        <Col md={6}>
                                            <Card className="text-center border-0 shadow-sm bg-light">
                                                <CardHeader>
                                                    <h5>
                                                        Common challenges
                                                    </h5>                                        
                                                </CardHeader>
                                                <CardBody className='text-start'>
                                                    <ul className="text-muted">
                                                        <li>Time management during the exam</li>
                                                        <li>Misunderstanding of key concepts</li>
                                                        <li>Low retention of previously covered topics</li>
                                                        <li>Technical issues or distractions</li>
                                                    </ul>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col md={6}>
                                            <Card className="text-center border-0 shadow-sm bg-light">
                                                <CardHeader>
                                                    <h5>
                                                        Recomendations
                                                    </h5>
                                                </CardHeader>
                                                <CardBody className='text-start'>
                                                    <ul className="text-muted">
                                                        <li>Introduce regular revision quizzes</li>
                                                        <li>Encourage collaborative learning sessions</li>
                                                        <li>Break down complex topics into smaller parts</li>
                                                        <li>Provide time management strategies</li>
                                                    </ul>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </CardBody>                   
                            </>
                        ):
                        <CardBody>
                            {/*Here shows the text which says no contents to preview */}
                            <Alert variant="info">
                                <p className="mb-0">
                                    No report available to preview. Please select the criteria and generate a report.
                                </p>
                            </Alert>
                        </CardBody>
                    }
                    </Card>
                </CardBody>
            </Card>
        </>)}
    </Col>
  )
}
