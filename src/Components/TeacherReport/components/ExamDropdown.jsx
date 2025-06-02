import React from 'react';
import { Form } from 'react-bootstrap';
import useFetchExams from '../hooks/useFetchExams'

const ExamDropdown = ({ selectedCourse, selectedExam, setSelectedExam, setError }) => {
    const { exams, loading } = useFetchExams(selectedCourse, setError);

    return (
        <Form.Group>
            <Form.Label className="fw-bold">
                Exam Title *
            </Form.Label>
            <Form.Select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                disabled={loading || !selectedCourse}
            >
                <option value="">Select an exam</option>
                {exams.length === 0 && (
                    <option disabled>No exams available</option>
                )}
                {exams.map((ex) => (
                    <option key={ex.exam_id} value={ex.exam_id}>
                        {ex.title}
                    </option>
                ))} 
            </Form.Select>
        </Form.Group>
    );
};

export default ExamDropdown;