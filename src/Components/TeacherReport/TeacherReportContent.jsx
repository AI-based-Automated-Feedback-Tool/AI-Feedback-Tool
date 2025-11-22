import { useState } from 'react';
import { useEffect } from 'react';
import { supabase } from '../../SupabaseAuth/supabaseClient';
import { Row, Col, CardHeader, CardBody, Card, Button, Alert } from 'react-bootstrap';
import CourseDropdown from './components/CourseDropdown';
import StudentDropdown from './components/StudentDropdown';
import ExamDropdown from './components/ExamDropdown'; 
import LoadingCard from './components/LoadingCard';
import useFetchExamSubmissions from './hooks/useFetchExamSubmissions';
import useFetchMcqQuestions from './hooks/useFetchMcqQuestions';
import ScoreDistributionChart from './components/ScoreDistributionChart';
import ReportStatsCards from './components/ReportStatsCards';
import PerformanceAnalysisCards from './components/PerformanceAnalysisCards';
import QuestionAccuracyChart from './components/QuestionAccuracyChart';
import useFetchSubmittedExamAnswers from './hooks/useFetchSubmittedExamAnswers';
import useReportCalculations from './hooks/useReportCalculations';
import calculateScoreDistribution from './utils/calculateScoreDistribution';
import calculateQuestionStats from './utils/calculateQuestionStats';
import StyledDivider from './components/StyledDivider';
import useFetchCodeQuestions from './hooks/useFetchCodeQuestions';
import useFetchExams from './hooks/useFetchExams';  
import useFetchEssayQuestions from './hooks/useFetchEssayQuestions';   
import useFetchStudentReportData from './hooks/useFetchStudentReportData';
import StudentReportCard from './components/StudentReportCard'; 
import useFetchCourses from './hooks/useFetchCourses';

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

    const {mcqQuestions, loadingMcq} = useFetchMcqQuestions(selectedExam, setReportError)
    const {codeQuestions, loadingCode} = useFetchCodeQuestions(selectedExam, setReportError);
    const {essayQuestions, loadingEssay} = useFetchEssayQuestions(selectedExam, setReportError);
    const {exams, loadingExams} = useFetchExams(selectedCourse, setError);
    const [submissionId, setSubmissionId] = useState([]);

    const { courses, courseLoading } = useFetchCourses(userId, setError); //phase2

    //find exam type
    const selectedExamObject = exams.find((exam) => exam.exam_id === selectedExam)
    const examType = selectedExamObject?.type || 'mcq';

    // Fetch student report data
    const { studentReportData, loadingStudentReport } = useFetchStudentReportData(selectedExam, selectedStudent, examType, setReportError);


    const { scores, avgScore, highestScore, iniTotalScore, noOfStudentsDoneExam, avgTimeInMinutes, avgFocusLoss } = useReportCalculations(examSubmissions, mcqQuestions, codeQuestions, essayQuestions, examType);

    const scoreDistributionData = calculateScoreDistribution(scores, iniTotalScore);  
    const {submittedAnswers, loadingAnswers} = useFetchSubmittedExamAnswers(submissionId, examType, setReportError);
    const questionStats = calculateQuestionStats(submittedAnswers, mcqQuestions, codeQuestions, essayQuestions, examType, noOfStudentsDoneExam);
 
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

    // submission ids according to exam
    useEffect(() => {
        if (!examSubmissions || examSubmissions.length === 0) {
            setSubmissionId([]);
            return;
        }
        // Extract submission IDs from the exam submissions
        const submissionIdDetails = examSubmissions.map((submission) => submission.id);
        setSubmissionId(submissionIdDetails);
    }, [examSubmissions])


  return (
    <Col
        className="w-100 "
        style={{ backgroundColor: '#f8f9fa' }}
    >
        {loadingUser || courseLoading ? (
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
                                        formState={{
                                            courses,
                                            courseLoading
                                        }}
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
                    
                    {/* Report Section */}
                    <Card className="mb-4 border-0 shadow-sm">
                        {!reportRequested || !reportData ? (
                            <CardBody>
                                <Alert variant="info">
                                    <p className="mb-0">
                                        No report available to preview. Please select the criteria and generate a report.
                                    </p>
                                </Alert>
                            </CardBody>
                        ) : (selectedCourse && selectedExam && selectedStudent) ? (
                            <>
                                <CardHeader className="bg-white">
                                    <h5>📊 Student Report</h5>
                                </CardHeader>
                                {/*  Insert student-specific report */}
                                <CardBody>
                                    {reportError ? (
                                        <CardBody>
                                            <Alert variant="danger">{reportError}</Alert>
                                        </CardBody>
                                    ) : studentReportData ?  (
                                        <CardBody>
                                            <StudentReportCard studentReportData={studentReportData} examType={examType} />
                                        </CardBody>
                                    ) : (
                                        <CardBody>
                                            <Alert variant="info">
                                                No report data available for this student.
                                            </Alert>
                                        </CardBody>
                                    )}
                                </CardBody>
                            </>
                        ): (selectedCourse && selectedExam) ? (
                            <>
                                <CardHeader className="bg-white">
                                    <h5>
                                        📊 Overall Exam Report
                                    </h5>
                                </CardHeader>
                                {reportError ? (
                                    <CardBody>
                                        <Alert variant="danger">{reportError}</Alert>
                                    </CardBody>
                                ) : noOfStudentsDoneExam === 0 ? (
                                    <CardBody>
                                        <Alert variant="info">
                                            No students have completed this exam yet.
                                        </Alert>
                                    </CardBody>
                                ) : (
                                    <>
                                        <ReportStatsCards 
                                            noOfStudentsDoneExam={noOfStudentsDoneExam}
                                            avgScore={avgScore}
                                            highestScore={highestScore}
                                        />
                                        <StyledDivider />
                                        <ScoreDistributionChart scoreDistributionData={scoreDistributionData} />
                                        <StyledDivider />
                                        <PerformanceAnalysisCards 
                                            avgTimeInMinutes={avgTimeInMinutes} 
                                            avgFocusLoss={avgFocusLoss}
                                        />
                                        <StyledDivider />
                                        <QuestionAccuracyChart questionStats={questionStats} />
                                    </>
                                )}
                            </>
                        ):null
                        }
                    </Card>
                </CardBody>
            </Card>
        </>)}
    </Col>
  )
}
