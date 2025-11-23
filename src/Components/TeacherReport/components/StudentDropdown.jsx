import { Form } from 'react-bootstrap';

const StudentDropdown = ({ selectedCourse, selectedStudent, setSelectedStudent, formState }) => {
    const { students, loadingStudents } = formState;

    return (
        <Form.Group>
            <Form.Label className="fw-bold">
                Student name
            </Form.Label>
            <Form.Select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                disabled={loadingStudents || !selectedCourse}
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