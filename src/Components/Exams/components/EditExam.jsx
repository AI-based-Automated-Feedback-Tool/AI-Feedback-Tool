import { Modal, Form,Row, Col } from 'react-bootstrap'
import { useEffect } from 'react';
import useEditExam from '../hooks/useEditExam';
import EditMcqQuestionCollection from './EditMcqQuestionCollection';
import { useNavigate } from 'react-router-dom';
import EditCodeQuestionCollection from './EditCodeQuestionCollection';
import EditEssayQuestionCollection from './EditEssayQuestionCollection';
import { useRef } from 'react';
import { uploadAttachment } from "../../CreateQuestions/CreateEssayQuestions/service/createEssayQuestionService";
import '../../../css/EditExam/EditExam.css';


export default function EditExam({formState, examId, show, handleClose, onSaveSuccess}) {
    const essayAttachmentRef = useRef({});
    const {
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
    } = formState;

    const navigate = useNavigate();

    function formatDateTimeToLocalInput(utcDateString) {
        if (!utcDateString) return '';

        const date = new Date(utcDateString); // parses as UTC

        const localISO = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16); // YYYY-MM-DDTHH:mm

        return localISO;
    }

    useEffect(() => {
        if (show && examDetails) {
            setType(examDetails.type);
            setDuration(examDetails.duration);
            setStartTime(formatDateTimeToLocalInput(examDetails.start_time));
            setEndTime(formatDateTimeToLocalInput(examDetails.end_time));
            setInstructions(examDetails.instructions);
            setAiAssessmentGuide(examDetails.ai_assessment_guide);
            setQuestionCount(examDetails.question_count);
            setQuestions(JSON.parse(JSON.stringify(examDetails.questions)));
        }
    }, [show, examDetails]);
    
    const formatDateTime = (utcDateString) => {
        if (!utcDateString) return '';

        const date = new Date(utcDateString); // this parses the UTC time

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`; // format for datetime-local
    };

    const manageSaveChanges = async() => {
        const isValid = validate();
        if (!isValid) {
            return;
        }
        let updatedExam = {};
        examDetails?.type === 'mcq' && (
            updatedExam = {
                exam_id: examId,
                type:type,
                duration:duration,
                start_time:startTime,
                end_time:endTime,
                instructions:instructions,
                ai_assessment_guide:aiAssessmentGuide,
                question_count:questionCount,
                questions: questions.map(q => ({
                    question_id: q.question_id,
                    question_text: q.question_text,
                    options: q.options,
                    answers: q.answers,
                    points: q.points,
                    no_of_correct_answers: q.no_of_correct_answers
                }))
            }
        );
        examDetails?.type === 'code' && (
            updatedExam = {
                exam_id: examId,
                type:type,
                duration:duration,
                start_time:startTime,
                end_time:endTime,
                instructions:instructions,
                ai_assessment_guide:aiAssessmentGuide,
                question_count:questionCount,
                questions: questions.map(q => ({
                    question_id: q.question_id,
                    question_description: q.question_description,
                    function_signature: q.function_signature,
                    wrapper_code: q.wrapper_code,
                    points: q.points,
                    test_cases: q.test_cases.map(tc => ({
                        input: tc.input,
                        output: tc.output
                    }))
                }))
            }
        );

        if (examDetails?.type === 'essay') {
            const originalAttachments = essayAttachmentRef.current;

            for (const q of questions) {
                const original = originalAttachments[q.question_id];

                // Delete if removed
                if (original && !q.attachment_url && !q.attachments) {
                const filePath = original.replace(getPublicAttachmentUrl(''), '');
                await removeAttachment(filePath);
                }

                // Upload if it's a new file
                if (q.attachments instanceof File) {
                const { url } = await uploadAttachment(q.attachments);
                q.attachment_url = url.publicUrl;
                q.attachments = null;
                }
            }

            updatedExam = {
                exam_id: examId,
                type,
                duration,
                start_time: startTime,
                end_time: endTime,
                instructions,
                ai_assessment_guide: aiAssessmentGuide,
                question_count: questionCount,
                questions: questions.map(q => ({
                question_id: q.question_id,
                question_text: q.question_text,
                grading_note: q.grading_note,
                word_limit: q.word_limit,
                points: q.points,
                attachment_url: q.attachment_url || null
                }))
            };
        }

        try {
            setLoading(true);
            setError({});
            const saved = await manageSaveChangesToExam(updatedExam);
            console.log('Result from manageSaveChangesToExam:', saved); 
            if (saved) {
                console.log('Saved successfully!');
                handleClose();
                onSaveSuccess?.();
            }
        } catch (error) {
            setError({ message: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
    <Modal show={show} onHide={handleClose} size="lg" className="edit-exam-modal">
        <Modal.Header closeButton className="edit-exam-header">
            <Modal.Title>
                <i className="fas fa-cog me-3"></i>
                Edit Exam - {type?.toUpperCase()} Exam
            </Modal.Title>
        </Modal.Header>

        <Modal.Body className="edit-exam-body">
            <Row className="g-4 mb-5">
                <Col lg={6}>
                    <div className="form-section">
                        <h6 className="section-title">
                            <i className="fas fa-info-circle text-primary me-2"></i>
                            Exam Instructions
                        </h6>
                        <Form.Group controlId="exam-instructions">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={instructions || ''}
                                onChange={(e) => setInstructions(e.target.value)}
                                placeholder="Write any special instructions for students..."
                            />
                        </Form.Group>
                    </div>
                </Col>

                <Col lg={6}>
                    <div className="form-section">
                        <h6 className="section-title">
                            <i className="fas fa-robot text-indigo me-2"></i>
                            AI Assessment Guide
                        </h6>
                        <Form.Group controlId="exam-ai-guide">
                            <Form.Control
                                as={"textarea"}
                                rows={3}
                                value={aiAssessmentGuide || ''}
                                onChange={(e) => setAiAssessmentGuide(e.target.value)}
                                placeholder="How should the AI evaluate and give feedback?"
                            />
                        </Form.Group>
                    </div>
                </Col>
            </Row>

            <Row className="g-4 mb-4">
                <Col md={4}>
                    <div className="form-section">
                        <h6 className="section-title">
                            <i className="fas fa-clock text-success me-2"></i>
                            Duration (min)
                        </h6>
                        <Form.Group className="exam-duration">
                            <Form.Control
                                type='number'
                                min="1"
                                value={duration || ''}
                                onChange={(e) => setDuration(e.target.value)}
                            />
                        </Form.Group>
                    </div>
                </Col>

                <Col md={4}>
                    <div className="form-section">
                        <h6 className="section-title">
                            <i className="fas fa-calendar-alt text-primary me-2"></i>
                            Start Time
                        </h6>
                        <Form.Group controlId="exam-start-time">
                            <Form.Control
                                type="datetime-local"
                                value={formatDateTime(startTime)}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </Form.Group>
                    </div>
                </Col>

                <Col md={4}>
                    <div className="form-section">
                        <h6 className="section-title">
                            <i className="fas fa-calendar-check text-danger me-2"></i>
                            End Time
                        </h6>
                        <Form.Group controlId="exam-end-time">
                            <Form.Control
                                type="datetime-local"
                                value={formatDateTime(endTime)}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </Form.Group>
                    </div>
                </Col>
                {error.duration && <div className="text-danger small">{error.duration}</div>}
                {error.startTime && <div className="text-danger small">{error.startTime}</div>}
                {error.endTime && <div className="text-danger small">{error.endTime}</div>}

            </Row>

            <div className="divider mb-4"></div>

            <div className="questions-section mt-5">
                { examDetails?.type === 'mcq' && <EditMcqQuestionCollection
                    questions={questions}
                    setQuestions={setQuestions}
                />}

                { examDetails?.type === 'code' && (
                    <EditCodeQuestionCollection
                        questions={questions}
                        setQuestions={setQuestions}
                    />
                )} 

                { examDetails?.type === 'essay' && (
                    <EditEssayQuestionCollection
                        questions={questions}
                        setQuestions={setQuestions}
                    />
                )} 
            </div>
        </Modal.Body>

        <Modal.Footer className="">
            <button 
                type="button" 
                className="action-btn action-btn-secondary px-4"
                onClick={handleClose}
                disabled={loading}
            >
                Close
            </button>
            <button 
                type="button"
                className="action-btn px-5"
                onClick={manageSaveChanges}
                disabled={loading}
            >
                {loading ? (
                    <>
                        <span className="spinner"></span> Saving...
                    </>
                    ) : (
                    <>
                        <i className="fas fa-save me-2"></i> Save Changes
                    </>
                )}
            </button>
        </Modal.Footer>
    </Modal>
  )
}
