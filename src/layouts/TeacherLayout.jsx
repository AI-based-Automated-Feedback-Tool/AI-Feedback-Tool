import React, { useState } from "react";
import { Container, Row, Col, Button, Navbar, Nav, Offcanvas } from "react-bootstrap";
import Header from "../Components/Header";
import SidebarTeacher from "../Components/SidebarTeacher";
import ConfigureExam from "../Components/ConfigureExam";
import { Outlet } from "react-router-dom";

const TeacherLayout = () => {
  // State to manage sidebar visibility
  const [showSidebar, setShowSidebar] = useState(false);
  // Function to toggle sidebar visibility
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <>
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      {/*Sidebar */}
      <Container fluid>
        <Row>
          <Col md={3}>
            <SidebarTeacher show={showSidebar} onHide={toggleSidebar} />
          </Col>
          
          {/* Main content area */}
          <Col xs={12} md={9} className="p-4">
            <Outlet />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TeacherLayout;