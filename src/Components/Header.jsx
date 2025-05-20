import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { FaUserCircle, FaBars } from "react-icons/fa";

export default function Header({ toggleSidebar }) {
  return (
    <Navbar bg="primary" variant="dark" expand="md" className="shadow-sm py-2">
      <Container fluid>
        <Button
          variant="outline-light"
          className="d-md-none me-3 p-2"
          onClick={toggleSidebar}
          style={{ width: "40px", height: "40px" }}
        >
          <FaBars />
        </Button>
        
        <Navbar.Brand href="#" className="fw-bold fs-4">
          AI Feedback Tool
        </Navbar.Brand>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            <Nav.Link className="d-flex align-items-center gap-2">
              <FaUserCircle className="text-white fs-4" />
              <span className="text-white">Logout</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}