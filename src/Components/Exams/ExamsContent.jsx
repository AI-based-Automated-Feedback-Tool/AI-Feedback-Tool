import { Spinner, Badge ,Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import useExamDetails from './hooks/useExamDetails';
import EditExam from './components/EditExam';
import { useNavigate } from 'react-router-dom';
import '../../css/EditExam/ExamDetails.css';
import useEditExam from './hooks/useEditExam';


export default function ExamsContent() {
    const { examId, course_id } = useParams();
    const {
        examDetails,
        loading,
        error,
        formatDateTime,
        type,
        setType,
        duration,
        setDuration,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        instructions,
        setInstructions,
        aiAssessmentGuide,
        setAiAssessmentGuide,           
        questionCount,
        setQuestionCount,
        manageSaveChangesToExam,
        setError,
        setLoading,
        validate,
        questions,
        setQuestions
    }= useEditExam({ examId });

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
                  <h6 className="mb-0 d-flex align-items-center gap-3">
                    <i className="fas fa-laptop-code fs-3" style={{ color: '#3234a0' }} ></i>
                    <span className="fw-bold">Q{i + 1}. {q.question_description || 'Write a function...'}</span>
                  </h6>
                  <Badge bg="success" className="fs-6 px-3 py-2">{q.points} pts</Badge>
                </div>

                {/* Function Signature */}
                <div className="mb-4">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="fas fa-signature code-label"></i>
                    <strong className=" code-label ">
                      Function Signature
                    </strong>
                  </div>
                  <pre className="code-block signature p-3 rounded overflow-auto">
                    <code>{q.function_signature}</code>
                  </pre>
                </div>

                {/* Wrapper Code */}
                {q.wrapper_code && (
                  <div className="mb-4">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className="fas fa-cogs code-label"></i>
                      <strong className="code-label">Wrapper Code</strong>
                    </div>
                    <pre className="code-block wrapper p-3 rounded overflow-auto">
                      <code>{q.wrapper_code}</code>
                    </pre>
                  </div>
                )}

                {/* Test Cases */}
                <div className="test-cases-section">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <i className="fas fa-vial code-label"></i>
                    <strong className='code-label'>
                      Test Cases ({q.test_cases?.length || 0})
                    </strong>
                  </div>

                  <div className="accordion modern-testcases-accordion">
                    <div className="accordion-item border-0 rounded-3 overflow-hidden shadow-sm">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed fw-semibold py-3"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#testcases-table-${q.question_id}`}
                        >
                          <i className="fas fa-table me-2"></i>
                          View all test cases
                          <span className="ms-2 text-muted small">({q.test_cases?.length} cases)</span>
                        </button>
                      </h2>
                      <div
                        id={`testcases-table-${q.question_id}`}
                        className="accordion-collapse collapse"
                      >
                        <div className="accordion-body p-0">
                          <div className="table-responsive">
                            <table className="table table-hover mb-0 modern-testcases-table">
                              <thead>
                                <tr className="bg-gradient-header text-white">
                                  <th className="text-center py-3 fw-semibold">Input</th>
                                  <th className="text-center py-3 fw-semibold">Expected Output</th>
                                </tr>
                              </thead>
                              <tbody>
                                {q.test_cases?.map((tc, index) => (
                                  <tr key={index} className="align-middle">
                                    <td className="font-monospace small text-muted py-3">
                                      <pre className="mb-0 px-3 py-2 bg-light rounded-3">
                                        {JSON.stringify(tc.input, null, 2)}
                                      </pre>
                                    </td>
                                    <td className="font-monospace small text-success py-3">
                                      <pre className="mb-0 px-3 py-2 bg-success-subtle text-success fw-500 rounded-3">
                                        {JSON.stringify(tc.output, null, 2)}
                                      </pre>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {!q.test_cases?.length && (
                            <div className="p-4 text-center text-muted small">
                              No test cases defined
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="essay-divider mt-4"></div>
              </div>
            ))}

            {examDetails.type === 'essay' && examDetails.questions.map((q, i) => (
              <div key={q.question_id} className="question-preview-card essay-question-card mb-5">
                {/* Header with icon and points */}
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <h6 className="mb-0 d-flex align-items-center gap-3">
                    <i className="fas fa-file-alt text-indigo fs-4"></i>
                    <span>Q{i + 1}. {q.question_text || 'Write your essay...'}</span>
                  </h6>
                  <Badge bg="warning" className="fs-6 px-3 py-2">
                    {q.points} pts
                  </Badge>
                </div>

                {/* Info Grid */}
                <div className="essay-info-grid mb-4">
                  <div className="info-item">
                    <i className="fas fa-align-left text-muted me-2"></i>
                    <strong>Word Limit:</strong> {q.word_limit || 'No limit'}
                  </div>
                  {q.grading_note && (
                    <div className="info-item grading-note">
                      <i className="fas fa-lightbulb text-warning me-2"></i>
                      <strong>Grading Note:</strong>
                      <p className="mt-2 mb-0 text-muted small">{q.grading_note}</p>
                    </div>
                  )}
                </div>

                {/* Attachment (if exists) */}
                {q.attachment_url && (
                  <div className="attachment-preview p-3 rounded d-flex align-items-center gap-3">
                    <i className="fas fa-paperclip fs-3 text-primary"></i>
                    <div className="flex-grow-1">
                      <strong>Attached File:</strong>
                        <a
                          href={q.attachment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="attachment-link ms-2"
                        >
                          {getFileName(q.attachment_url)}
                        </a>
                    </div>
                    <i className="fas fa-external-link-alt text-muted"></i>
                  </div>
                )}

                <div className="essay-divider mt-4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {examDetails && (
        <EditExam
          formState={{
            examDetails,
            error,
            type,
            setType,
            duration,
            setDuration,
            startTime,
            setStartTime,
            endTime,
            setEndTime,
            instructions,
            setInstructions,
            aiAssessmentGuide,
            setAiAssessmentGuide,           
            questionCount,
            setQuestionCount,
            manageSaveChangesToExam,
            setError,
            loading,
            setLoading,
            validate,
            questions,
            setQuestions
          }}
          examId={examId}
          show={showEditExam}
          handleClose={closeEditExam}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </div>
    
  )
}
