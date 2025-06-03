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
    const [submissionId, setSubmissionId] = useState([]);
    const {submittedAnswers, loadingAnswers} = useFetchSubmittedExamAnswers(submissionId, setReportError);

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

    //report content
    const noOfStudentsDoneExam = examSubmissions.length;
    const scores = examSubmissions.map((submission) => submission.total_score)
    let totalScore = 0;
    for(let i=0; i<scores.length; i++){
        totalScore = totalScore+scores[i]
    }
    const avgScore = noOfStudentsDoneExam > 0 ? (totalScore / noOfStudentsDoneExam).toFixed(2) : 0;
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;

    //calculate total score assigned by teacher when creating the exam
    const iniScore = mcqQuestions.map((q) => q.points)
    let iniTotalScore = 0
    for(let i=0; i<iniScore.length; i++){
        iniTotalScore += iniScore[i]
    }

    //Grapgh data 
    const noOfContainers = 7;
    const containerSize = Math.ceil(iniTotalScore/noOfContainers) //round up to the next whole number
    const scoreContainers = new Array(7).fill(0)
    scores.forEach(score =>{
        let containerIndex = Math.min(Math.floor(score/containerSize) , noOfContainers-1)
        scoreContainers[containerIndex]++
    })

    //score distribution data
    const scoreDistributionData = scoreContainers.map((count, index) => {
        const start = index*containerSize
        const end = (index === noOfContainers-1) ? iniTotalScore : (start + containerSize -1)
        return {
            scoreRange: `${start} - ${end}`,
            students: count
        }
    })

    //average time taken
    const time = examSubmissions.map((submission) => submission.time_taken);
    let totalTime = 0;
    for(let i=0; i<time.length; i++){
        totalTime += time[i]
    }
    const avgTime = totalTime / noOfStudentsDoneExam;
    const avgTimeInMinutes = (avgTime / 60).toFixed(2); 

    //average focus loss
    const focusLoss = examSubmissions.map((submission) => submission.focus_loss_count);
    let totalFocusLoss = 0;
    for(let i=0; i<focusLoss.length; i++){
        totalFocusLoss += focusLoss[i]
    }
    const avgFocusLoss = (totalFocusLoss / noOfStudentsDoneExam).toFixed(2);

    // submission ids according to exam
    useEffect(() => {
        if (!examSubmissions || examSubmissions.length === 0) {
            setSubmissionId([]);
            return;
        }
        // Extract submission IDs from the exam submissions
        const submissionIdDetails = examSubmissions.map((submission) => submission.submission_id);
        setSubmissionId(submissionIdDetails);
    }, [examSubmissions])

    // take submitted answers to get question id and is it correct or wrong
    const filteredSubmittedAnswers = submittedAnswers.map((answer) => {
        return {
            questionId: answer.question_id,
            isCorrect: answer.is_correct
        };
    });

    // Group answers by question ID 
    const questionStats = mcqQuestions.map((question, index) => {
        let correct = 0;
        let incorrect = 0;
        filteredSubmittedAnswers.forEach((answer) => {
            if (answer.questionId === question.question_id) {
                if (answer.isCorrect === true) {
                    correct++;
                } else {
                    incorrect++;
                }
            }
        })
        return {
            questionId: question.question_id,
            id: `Question ${index + 1}`,
            full: question.question_text,
            correct: (correct / noOfStudentsDoneExam * 100).toFixed(2), 
            incorrect: (incorrect / noOfStudentsDoneExam * 100).toFixed(2) 
        };
    })

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
                                <ReportStatsCards 
                                    noOfStudentsDoneExam={noOfStudentsDoneExam}
                                    avgScore={avgScore}
                                    highestScore={highestScore}
                                />
                                <hr style={{
                                    border: 'none',
                                    height: '2px',
                                    width: '95%',
                                    backgroundColor: '#dee2e6',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '4px',
                                    margin: '1rem auto'
                                }} />
                                <ScoreDistributionChart scoreDistributionData={scoreDistributionData} />
                                <hr style={{
                                    border: 'none',
                                    height: '2px',
                                    width: '95%',
                                    backgroundColor: '#dee2e6',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '4px',
                                    margin: '1rem auto'
                                }} />
                                <PerformanceAnalysisCards 
                                    avgTimeInMinutes={avgTimeInMinutes} 
                                    avgFocusLoss={avgFocusLoss}
                                />
                                <hr style={{
                                    border: 'none',
                                    height: '2px',
                                    width: '95%',
                                    backgroundColor: '#dee2e6',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '4px',
                                    margin: '1rem auto'
                                }} />
                                <QuestionAccuracyChart questionStats={questionStats} />

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
