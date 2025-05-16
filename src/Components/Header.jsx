import { Container, Row, Col, Button, Navbar, Nav, Offcanvas } from "react-bootstrap";
import React from 'react'

export default function Header({toggleSidebar}) {
  return (
    <>
      <Navbar bg="primary" variant="dark" expand="md" className="mb-3">
        <Container fluid>
          <Button 
            variant="outline-light" 
            className="d-md-none me-2" 
            onClick={toggleSidebar}
          >
            ☰
          </Button>
          <Navbar.Brand href="#">My Exam App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#profile">Profile</Nav.Link>
              <Nav.Link href="#logout">Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}