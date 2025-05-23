import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { FaUserCircle, FaBars, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LogOut from "./LogOut";

export default function Header({ toggleSidebar }) {
  const navigate = useNavigate();
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
        
        <Navbar.Brand 
          onClick={() => navigate("/teacher")} 
          className="fw-bold fs-4"
          style={{ cursor: 'pointer' }}
        >
          AI Feedback Tool
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            <Button 
              variant="link" 
              className="text-white p-0"
              onClick={() => navigate("/teacher/profile")}
            >
              <FaUserCircle className="fs-4" />
            </Button>
            
            <LogOut className="text-white" />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}