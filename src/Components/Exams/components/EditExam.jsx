import { Modal, Form, Button, Row, Col, Accordion } from 'react-bootstrap'
import { useEffect } from 'react';
import useEditExam from '../hooks/useEditExam';
import EditMcqQuestionCollection from './EditMcqQuestionCollection';
import { useNavigate } from 'react-router-dom';
import EditCodeQuestionCollection from './EditCodeQuestionCollection';
import EditEssayQuestionCollection from './EditEssayQuestionCollection';
import { useRef } from 'react';
import { uploadAttachment } from "../../CreateQuestions/CreateEssayQuestions/service/createEssayQuestionService";


export default function EditExam({examId, show, handleClose, onSaveSuccess}) {
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
        setLoading,
        validate,
        questions,
        setQuestions
    } = useEditExam({examId});

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
        if (examDetails) {
            setType(examDetails.type);
            setDuration(examDetails.duration);
            setStartTime(formatDateTimeToLocalInput(examDetails.start_time));
            setEndTime(formatDateTimeToLocalInput(examDetails.end_time));
            setInstructions(examDetails.instructions);
            setAiAssessmentGuide(examDetails.ai_assessment_guide);
            setQuestionCount(examDetails.question_count);
            setQuestions(examDetails.questions);
        }
    }, [examDetails]);
    
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
    <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>Edit Exam</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Exam instructions</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>AI Assessment Guide</Form.Label>
                        <Form.Control
                            as={"textarea"}
                            rows={3}
                            value={aiAssessmentGuide}
                            onChange={(e) => setAiAssessmentGuide(e.target.value)}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Question Type</Form.Label>
                        <Form.Control
                            type='text'
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        />
                        {error.type && <div className="text-danger small">{error.type}</div>}
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Question Count</Form.Label>
                        <Form.Control
                            type="number"
                            value={questionCount}
                            onChange={(e) => setQuestionCount(e.target.value)}
                        />
                        {error.questionCount && <div className="text-danger small">{error.questionCount}</div>}
                    </Form.Group>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Start Time</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={formatDateTime(startTime)}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                        {error.startTime && <div className="text-danger small">{error.startTime}</div>}
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>End Time</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={formatDateTime(endTime)}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                        {error.endTime && <div className="text-danger small">{error.endTime}</div>}
                    </Form.Group>
                </Col>
            </Row>

            <hr />
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

        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="primary" onClick={manageSaveChanges}>Save Changes</Button>
        </Modal.Footer>
    </Modal>
  )
}
