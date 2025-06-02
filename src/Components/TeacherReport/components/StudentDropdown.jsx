import React from 'react';
import { Form } from 'react-bootstrap';
import useFetchStudents from '../hooks/useFetchStudents';

const StudentDropdown = ({ selectedCourse, selectedStudent, setSelectedStudent, setError }) => {
    const { students, loading } = useFetchStudents(selectedCourse, setError);

    return (
        <Form.Group>
            <Form.Label className="fw-bold">
                Student name
            </Form.Label>
            <Form.Select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                disabled={loading || !selectedCourse}
            >
                <option value="">Select a student</option>
                {students.length === 0 && (
                    <option disabled>No students available</option>
                )}
                {students.map((student) => (
                    <option 
                        key={student.user_id} 
                        value={student.user_id}
                    >
                        {student.name}
                    </option>
                ))}
            </Form.Select>
        </Form.Group>
  );
};

export default StudentDropdown;