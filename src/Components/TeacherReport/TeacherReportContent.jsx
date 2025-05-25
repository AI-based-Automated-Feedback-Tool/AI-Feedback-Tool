import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { supabase } from '../../SupabaseAuth/supabaseClient';
import { Row, Col, CardHeader, CardBody, Card, Button, Alert } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

export default function TeacherReportContent() {
    const [course, setCourse] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
            const getUserId = async () => {
                const { data, error } = await supabase.auth.getUser();
                if (error) {
                    setError("Failed to get user ID");
                } else {
                    setUserId(data.user.id);
                }
            }
            getUserId();
        }, []);

    useEffect(() => {
        if (!userId) return; 
        const getCourses = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`http://localhost:5000/api/teacher/reports/course?userId=${userId}`);
                const data = await res.json();
                if (res.ok) {
                    setCourse(data.courses);
                } else {
                    setError(data.message || "Failed to fetch courses");
                }
            } catch (err) {
                setError(err.message || "An error occurred while fetching courses");
            } finally {
                setLoading(false);
            }
        }
        getCourses()
    }, [userId]);

  return (
    <Col 
        className="w-100 " 
        style={{ backgroundColor: '#f8f9fa' }}
    >
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
                        {loading && <Alert variant="info">Loading ...</Alert>}
                        <Row className="mb-2 mb-md-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">
                                        Course ID *
                                    </Form.Label>
                                    <Form.Select
                                        value={selectedCourse}
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                    >
                                        <option value="">Select a course</option> 
                                        {course.map((c) => (
                                            <option key={c.course_id} value={c.course_id}>
                                                {c.course_code} - {c.title}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">
                                        Exam Title *
                                    </Form.Label>
                                    <Form.Select
                                        value={""}
                                        onChange={""}
                                    >
                                        <option value="">
                                            Select an exam
                                        </option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='mb-2 mb-md-3'>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">
                                        Student name 
                                    </Form.Label>
                                    <Form.Select
                                        value={""}
                                        onChange={""}
                                    >
                                        <option value="">
                                            Select a student
                                        </option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                        </Row>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="mt-2 mt-md-3"
                        >
                            Generate Report
                        </Button>
                    </CardBody>
                </Card>

                <Card className="mb-4 border-0 shadow-sm">
                    <CardBody>
                        {/*Here shows the text which says no contents to preview */}
                        <Alert variant="info">
                            <p className="mb-0">
                                No report available to preview. Please select the criteria and generate a report.
                            </p>
                        </Alert>
                    </CardBody>

                </Card>

            </CardBody>
        </Card>
    </Col>
  )
}
