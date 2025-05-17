import React from 'react'
import { Nav, Offcanvas } from "react-bootstrap";
import { Link } from 'react-router-dom';

export default function SidebarTeacher({show, onHide}) {
  return (
    <>
      {/* Offcanvas sidebar for small screens */}
      <div className="d-md-none">
        <Offcanvas show={show} onHide={onHide} className="bg-light">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/teacher">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/teacher/exams">Configure Exam</Nav.Link>
              <Nav.Link as={Link} to={"/teacher/reports"}>Reports</Nav.Link>
              <Nav.Link as={Link} to={"/teacher/students"}>Students</Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </div>

      {/* Static sidebar for md+ screens */}
      <div className="d-none d-md-block bg-light vh-100" style={{ position: "sticky", top: 0 }}>
        <Nav className="flex-column pt-3">
          <Nav.Link as={Link} to="/teacher">Dashboard</Nav.Link>
          <Nav.Link as={Link} to="/teacher/exams">Configure Exam</Nav.Link>
          <Nav.Link as={Link} to={"/teacher/reports"}>Reports</Nav.Link>
          <Nav.Link as={Link} to={"/teacher/students"}>Students</Nav.Link>
        </Nav>
      </div>
    </>
  );
};
