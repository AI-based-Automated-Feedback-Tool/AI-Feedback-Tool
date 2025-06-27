import { Modal, Form, Button, Row, Col } from 'react-bootstrap'
import { useEffect } from 'react';
import useEditExam from '../hooks/useEditExam';

export default function EditExam({examId, show, handleClose}) {
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
        manageSaveChangesToExam
    } = useEditExam({examId});  

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

    const manageSaveChanges = () => {
        const isValid = validate();
        if (!isValid) {
            return;
        }

        const updatedExam = {
            exam_id: examId,
            type:type,
            duration:duration,
            start_time:startTime,
            end_time:endTime,
            instructions:instructions,
            ai_assessment_guide:aiAssessmentGuide,
            question_count:questionCount,
        };
        manageSaveChangesToExam(updatedExam);

        // Reset form fields    
        resetForm();
    }

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
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="primary" onClick={manageSaveChangesToExam}>Save Changes</Button>
        </Modal.Footer>
    </Modal>
  )
}
