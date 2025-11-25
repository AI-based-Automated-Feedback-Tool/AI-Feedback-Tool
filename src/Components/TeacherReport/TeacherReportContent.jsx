import { useState } from 'react';
import { useEffect } from 'react';
import { supabase } from '../../SupabaseAuth/supabaseClient';
import { Row, Col, Spinner, CardBody, Card, Button, Alert, Badge} from 'react-bootstrap';
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
import useSelectStudents from './hooks/useSelectStudents';
import ExamReportTable from './components/ExamReportTable';
import useFetchStudents from './hooks/useFetchStudents';
import '../../css/Reports/TeacherReport.css';


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
    const {students, loadingStudents} = useFetchStudents(selectedCourse, setError);

    const { courses, courseLoading } = useFetchCourses(userId, setError); //phase2
    const { studentList, processing } = useSelectStudents(selectedCourse, setError, examSubmissions);

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
    }, [selectedCourse, selectedExam, selectedStudent]);

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

    // reset exam and student when course changes
    useEffect(() =>{
        setSelectedExam("");
        setSelectedStudent("");
    }, [selectedCourse])
    // reset student when exam changes
    useEffect(() =>{
        setSelectedStudent("");
    }, [selectedExam])

  return (
    <div
        className="report-page-wrapper"
    >
        {loadingUser || courseLoading ? (
            <LoadingCard />
        ) :(<div className='container'>
                <div className="page-header-card">
                    <div className="header-gradient-section">
                        <div className="header-icon-circle">
                            <i className="fas fa-chart-line"></i>
                        </div>
                        
                        <div className="header-text-content">
                            <h1 className="main-title">Teacher Report</h1>
                            <p className="main-subtitle">Analyze student performance with detailed insights</p>
                        </div>
                    </div>
                </div>
                    
                
                   
                <Card className="report-search-panel">
                    <Card.Body className="report-search-body">
                        <h4 className="report-search-title">
                            <i className="fas fa-search me-2"></i>
                            Search Criteria
                        </h4>
                        
                        {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}
                        <Row className="g-4">
                            <Col lg={4}>
                                <CourseDropdown 
                                    formState={{
                                        courses,
                                        courseLoading
                                    }}
                                    selectedCourse={selectedCourse} 
                                    setSelectedCourse={setSelectedCourse} 
                                    userId={userId} 
                                    setError={setError}
                                    className = "modern-dropdown"
                                />
                            </Col>

                            <Col lg={4}>
                                <ExamDropdown 
                                    selectedCourse={selectedCourse} 
                                    selectedExam={selectedExam} 
                                    setSelectedExam={setSelectedExam} 
                                    setError={setError}
                                    className = "modern-dropdown"
                                />
                            </Col>

                            <Col lg={4}>
                                <StudentDropdown 
                                    selectedCourse={selectedCourse} 
                                    selectedStudent={selectedStudent} 
                                    setSelectedStudent={setSelectedStudent} 
                                    setError={setError}
                                    formState={{ students, loadingStudents }}
                                    className = "modern-dropdown"
                                />
                            </Col>
                        </Row>

                        <div className='report-generate-section'>
                            <Button 
                                size = "lg" 
                                className="report-generate-btn"
                                onClick={generateReport}
                                disabled={loadingReport|| !selectedCourse || !selectedExam}
                                >
                                    {loadingReport ? (
                                        <>Generating Report <Spinner size="sm" className="ms-2" /></>
                                    ) : (
                                        <>Generate Report</>
                                    )}
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
                    
                    {/* Report Section */}
                    
                        {!reportRequested || (!reportData && !students) ? (
                            <Card className="text-center py-5 border-0 shadow-sm">
                                <Card.Body>
                                    <div className="text-muted fs-1 mb-3"></div>
                                    <h4 className="text-muted">Select criteria above to generate a report</h4>
                                </Card.Body>
                            </Card>
                        ) : (selectedCourse && selectedExam && selectedStudent) ? (
                            <div className="report-content">
                                <div className="report-section-header">
                                    <h2 className="report-section-title">
                                        <i className="fas fa-user-graduate me-3"></i>
                                        Student Performance Report
                                    </h2>
                                    <div className="report-section-divider"></div>
                                </div>
                                {/*  Insert student-specific report */}
                                <CardBody>
                                    {reportError ? (
                                        <Alert variant="danger" className="rounded-4 shadow">{reportError}</Alert>
                                    ) : studentReportData ?  (
                                        <StudentReportCard studentReportData={studentReportData} examType={examType} />
                                    ) : (
                                        <Alert variant="info">No data found for this student.</Alert>
                                    )}
                                </CardBody>
                            </div>
                        ): (selectedCourse && selectedExam) ? (
                            <div className="report-content">
                                <div className="report-section-header">
                                    <h2 className="report-section-title">
                                        <i className="fas fa-chart-bar me-3"></i>
                                        Overall Exam Report
                                    </h2>
                                    <div className="report-section-subtitle">
                                        {noOfStudentsDoneExam} student{noOfStudentsDoneExam !== 1 ? 's' : ''} completed the exam
                                    </div>
                                    <div className="report-section-divider"></div>
                                </div>
                                {reportError ? (
                                    <Alert variant="danger" className="rounded-4 shadow">{reportError}</Alert>
                                ) : students.length === 0 ? (
                                    <Alert variant="warning" className="rounded-4">
                                        No students enrolled in this course.
                                    </Alert>
                                ) : (students.length > 0 && noOfStudentsDoneExam === 0)  ? (
                                        
                                        <>
                                            
                                            <Alert variant="warning" className="rounded-4">
                                                    No students have completed this exam yet.
                                            </Alert>
                                            <ExamReportTable studentList={studentList} />
                                        </>
                                    ) : <>
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
                                            <StyledDivider />
                                            <ExamReportTable studentList={studentList} />
                                        </>
                                }
                            </div>
                        ):null
                    }
            </div>
        )}
    </div>
  )
}
