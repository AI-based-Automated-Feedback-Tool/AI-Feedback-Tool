import React, { useEffect, useState } from 'react';
import { Container, Form, Spinner } from 'react-bootstrap';
import { supabase } from '../../SupabaseAuth/supabaseClient';

const FeedbackSelector = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [examTypes, setExamTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase.from('courses').select('*');
      if (!error) setCourses(data);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchExamTypes = async () => {
      if (!selectedCourse) return;
      const { data, error } = await supabase
        .from('exams')
        .select('type')
        .eq('course_id', selectedCourse);

      if (!error && data.length > 0) {
        const types = Array.from(new Set(data.map((exam) => exam.type)));
        setExamTypes(types);
      } else {
        setExamTypes([]);
      }
    };
    fetchExamTypes();
  }, [selectedCourse]);

  

  const handleSelectExam = (examId) => {
    const exam = exams.find((e) => e.id === examId);
    setSelectedExam(exam);
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <Container className="my-4">
      <h3>Select Exam for AI Feedback</h3>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Course</Form.Label>
          <Form.Select onChange={(e) => setSelectedCourse(e.target.value)}>
            <option value="">-- Select a Course --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.course_id}>
                {course.title}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {examTypes.length > 0 && (
          <Form.Group className="mb-3">
            <Form.Label>Exam Type</Form.Label>
            <Form.Select onChange={(e) => setSelectedType(e.target.value)}>
              <option value="">-- Select Type --</option>
              {examTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}

        
          <Form.Group className="mb-3">
            <Form.Label>Exam</Form.Label>
            <Form.Select onChange={(e) => handleSelectExam(e.target.value)}>
              <option value="">-- Select Exam --</option>
              {exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
       
      </Form>
    </Container>
  );
};

export default FeedbackSelector;
