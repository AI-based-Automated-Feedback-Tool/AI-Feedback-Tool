import { Spinner, Badge ,Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import useExamDetails from './hooks/useExamDetails';
import EditExam from './components/EditExam';
import { useNavigate } from 'react-router-dom';
import '../../css/EditExam/ExamDetails.css';


export default function ExamsContent() {
    const { examId, course_id } = useParams();
    const {
        examDetails,
        loading,
        error,
        formatDateTime
    }= useExamDetails({ examId });

    const navigate = useNavigate();

    const [showEditExam, setShowEditExam] = useState(false);

    //function to handle edit exam
    const handleEditExam = (examId) => {
        setShowEditExam(true);
    };

    //function to close edit exam modal
    const closeEditExam = () => {
        setShowEditExam(false);
    };

    // function to get only file name from URL
    const getFileName = (url) => {
      const fileNameWithTimestamp = url ? url.split('/').pop() : null;
      if (fileNameWithTimestamp) {
        const spaceLessFileName = fileNameWithTimestamp.substring(fileNameWithTimestamp.indexOf('_') + 1);
        const trimmedName = spaceLessFileName.replace(/%20/g, ' ')
        return trimmedName;                  
      } 
    }

    const handleSaveSuccess = () => {
      navigate(`/teacher/courses/${course_id}/exams`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  /*if (error || !examDetails) {
    return <div className="alert alert-danger text-center">Failed to load exam.</div>;
  }*/

  return (
    <div className='exam-details-page pb-2'>
      <div className='container py-5'>

        {/* Top header */}
        <div className='top-card mb-5'>
          <div className='top-header'>
            <h1 className='top-title'>
              Exam Details
            </h1>
            <p className='top-subtitle'>
              View and manage your exam configuration
            </p>
          </div>
          <div className='top-footer d-flex justify-content-between align-items-center'>
            <div>
              <Badge bg="primary" className="me-2 fs-6">{examDetails.type.toUpperCase()}</Badge>
              <span className="text-muted">• {examDetails.question_count} Questions</span>
            </div>
            <Button
              onClick={() => handleEditExam(examId)}
              className="modern-edit-exam-btn d-flex align-items-center gap-2 px-4 py-2"
            >
              <i className="fas fa-edit"></i>
              <span>Edit Exam</span>
            </Button>
          </div>
        </div>

        {/* Exam Information Card */}
        <div className='glass-card-description mb-5'>
          <div className='gradient-header'>
            <h4>Exam Information</h4>
          </div>
          <div className='p-4'>
            <div className="row g-4">
              <div className="col-md-6">
                <p><strong>Duration</strong></p>
                <p className="text-muted">{examDetails.duration} minutes</p>
              </div>
              <div className="col-md-6">
                <p><strong>Start Time</strong></p>
                <p className="text-muted">{formatDateTime(examDetails.start_time)}</p>
              </div>
              <div className="col-md-6">
                <p><strong>End Time</strong></p>
                <p className="text-muted">{formatDateTime(examDetails.end_time)}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Instructions</strong></p>
                <p className="text-muted">{examDetails.instructions || 'No instructions provided'}</p>
              </div>
              {examDetails.ai_assessment_guide && (
                <div className="col-12">
                  <p><strong>AI Assessment Guide</strong></p>
                  <div className="bg-light p-3 rounded">
                    <small>{examDetails.ai_assessment_guide}</small>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Questions Preview */}
        <div className="glass-card">
          <div className="gradient-header">
            <h4>Questions ({examDetails.questions.length})</h4>
          </div>
          <div className="p-4">
            {examDetails.type === 'mcq' && examDetails.questions.map((q, i) => (
              <div key={q.question_id} className="question-preview-card mb-4">
                <div className="d-flex justify-content-between align-items-start">
                  <h6 className="mb-3">Q{i + 1}. {q.question_text}</h6>
                  <Badge bg="info">{q.points} pts</Badge>
                </div>
                <div className="options-grid">
                  {q.options.map((opt, idx) => {
                    const isCorrect = q.answers.includes(opt);
                    return (
                      <div
                        key={idx}
                        className={`option-item ${isCorrect ? 'correct' : ''}`}
                      >
                        <strong>{String.fromCharCode(65 + idx)}.</strong> {opt}
                        {isCorrect && <i className="fas fa-check ms-2 text-success"></i>}
                      </div>
                    );
                  })}
                </div>
                <small className="text-muted">
                  {q.no_of_correct_answers} correct answer{q.no_of_correct_answers > 1 ? 's' : ''}
                </small>
              </div>
            ))}

            {examDetails?.type === 'code' && examDetails.questions.map((q, i) => (
              <div key={q.question_id} className="question-preview-card mb-4">
                {/* Question Header */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h6 className="mb-0">
                    <i className="fas fa-code me-2 text-primary"></i>
                    Q{i + 1}. {q.question_description || 'Write a function...'}
                  </h6>
                  <Badge bg="info" className="fs-6">{q.points} pts</Badge>
                </div>

                {/* Function Signature */}
                <div className="mb-3">
                  <strong className="text-muted">
                    Function Signature
                  </strong>
                  <pre className="code-block signature mt-2 p-3 rounded">
                    <code>{q.function_signature || 'def solution(...)'}</code>
                  </pre>
                </div>

                {/* Wrapper Code (Hidden by default — collapsible) */}
                <details className="mb-3">
                  <summary className="text-primary fw-bold cursor-pointer">
                    Wrapper Code (Click to expand)
                  </summary>
                  <pre className="code-block wrapper mt-2 p-3 rounded">
                    <code>{q.wrapper_code || '# No wrapper code'}</code>
                  </pre>
                </details>

                {/* Test Cases */}
                <div>
                  <strong className="text-muted d-flex align-items-center gap-2">
                    Test Cases ({q.test_cases?.length || 0})
                  </strong>
                  <div className="test-cases-grid mt-3">
                    {q.test_cases?.map((tc, idx) => (
                      <div key={idx} className="test-case-item">
                        <div className="test-case-header">
                          <span className="test-case-number">Test {idx + 1}</span>
                        </div>
                        <div className="test-case-body">
                          <div>
                            <strong>Input:</strong>
                            <code className="d-block mt-1 p-2 bg-dark text-light rounded">
                              {JSON.stringify(tc.input, null, 2)}
                            </code>
                          </div>
                          <div className="mt-3">
                            <strong>Expected:</strong>
                            <code className="d-block mt-1 p-2 bg-success text-white rounded">
                              {JSON.stringify(tc.output, null, 2)}
                            </code>
                          </div>
                        </div>
                      </div>
                    ))}
                    {!q.test_cases?.length && (
                      <p className="text-muted small">No test cases defined</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {examDetails.type === 'essay' && examDetails.questions.map((q, i) => (
              <div key={q.question_id} className="question-preview-card mb-4">
                <h6 className="mb-3">Q{i + 1}. {q.question_text}</h6>
                <div className="d-flex gap-4 flex-wrap">
                  <div>
                    <strong>Word Limit:</strong> {q.word_limit}
                  </div>
                  <div>
                    <strong>Points:</strong> {q.points}
                  </div>
                </div>
                {q.grading_note && (
                  <div className="mt-3">
                    <strong>Grading Note:</strong>
                    <p className="text-muted small mt-1">{q.grading_note}</p>
                  </div>
                )}
                {q.attachment_url && (
                  <div className="mt-3">
                    <i className="fas fa-paperclip me-2"></i>
                    <a href={q.attachment_url} target="_blank" rel="noopener noreferrer">
                      {getFileName(q.attachment_url)}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <EditExam
        examId={examId}
        show={showEditExam}
        handleClose={closeEditExam}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
    
  )
}
