import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import "../../styles/TeacherCourses.css";

const TeacherCourses = () => {
  const courses = [
    {
      id: 1,
      code: "CS401",
      title: "Advanced Data Structures",
      description:
        "Covers trees, graphs, and algorithm optimization techniques",
    },
    {
      id: 2,
      code: "CS402",
      title: "Machine Learning Fundamentals",
      description:
        "Introduction to supervised and unsupervised learning algorithms",
    },
    {
      id: 3,
      code: "MATH301",
      title: "Discrete Mathematics",
      description: "Mathematical foundations for computer science",
    },
    {
      id: 4,
      code: "SE400",
      title: "Software Engineering",
      description: "Software development lifecycle and best practices",
    },
  ];
  //extracting userName from the location state, with a fallback to user
  const userName = location.state?.userName || "User";
  return (
    <Container className="my-4">
      <Card>
        <Card.Header className="bg-primary text-white">
          <h4>📚 My Courses</h4>
        </Card.Header>
        <Card.Body>
          <Row xs={1} md={2} lg={3} className="g-4">
            {courses.map((course) => (
              <Col key={course.id}>
                <Card className="course-card h-100">
                  <Card.Body>
                    <Card.Subtitle className="mb-2 text-muted course-code">
                      {course.code}
                    </Card.Subtitle>
                    <Card.Title className="course-title">
                      {course.title}
                    </Card.Title>
                    <Card.Text className="course-description">
                      {course.description}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-transparent border-top-0">
                    <button className="btn btn-outline-primary btn-sm">
                      View Details
                    </button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TeacherCourses;
