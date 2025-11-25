import React from 'react';
import { Form } from 'react-bootstrap';
import useFetchCourses from '../hooks/useFetchCourses';

const CourseDropdown = ({ formState, userId, selectedCourse, setSelectedCourse, setError }) => {
    const { courses, courseLoading } = formState;

    return (
        <Form.Group>
            <Form.Label className="fw-bold">
                Course *
            </Form.Label>
            <Form.Select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                disabled={courseLoading || !userId}
            >
                <option value="">Select a course</option>
                {courses.length === 0 && (
                    <option disabled>No courses available</option>
                )}
                {courses.map((c) => (
                    <option 
                        key={c.course_id} 
                        value={c.course_id}
                    >
                        {c.course_code} - {c.title}
                    </option>
                ))}
            </Form.Select>
        </Form.Group>
  );
};

export default CourseDropdown;