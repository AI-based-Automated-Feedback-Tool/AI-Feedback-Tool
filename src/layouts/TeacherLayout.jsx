import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../Components/Header";
import SidebarTeacher from "../Components/SidebarTeacher";
import { Outlet } from "react-router-dom";
import "../styles/teacher-styles.css"; 

const TeacherLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header toggleSidebar={toggleSidebar} />
      
      <Container fluid className="px-0">
  <Row className="g-0">
    <Col
      xs={12}
      md={3}
      lg={2.5}
      xl={2}    
      className="sidebar-col"
    >
      <SidebarTeacher show={showSidebar} onHide={toggleSidebar} />
    </Col>

    <Col
      xs={12}
      md={9}
      lg={9.5}
      xl={10}
      className="p-2"
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "calc(100vh - 56px)"
      }}
    >
      <Outlet />
    </Col>
  </Row>
</Container>

    </div>
  );
};

export default TeacherLayout;