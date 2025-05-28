import { Nav, Offcanvas } from "react-bootstrap";
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt,
  FaBook,
  FaUsers,
  FaChartBar,
  FaUser
} from "react-icons/fa";

export default function SidebarTeacher({ show, onHide }) {
  const location = useLocation();
  
  const menuItems = [
    { path: "/teacher", icon: <FaTachometerAlt />, label: "Dashboard" },
    { path: "/teacher/exams", icon: <FaBook />, label: "Configure Exam" },
    { path: "/teacher/students", icon: <FaUsers />, label: "Students" },
    { path: "/teacher/reports", icon: <FaChartBar />, label: "Reports" },
    { path: "/teacher/profile", icon: <FaUser />, label: "Profile" },
    { path: "/teacher/ai-feedback", icon: <FaChartBar />, label: "AI Feedback" }
  ];

  return (
    <>
      {/* Mobile Sidebar */}
      <Offcanvas 
        show={show} 
        onHide={onHide} 
        className="d-md-none"
        style={{ width: "280px" }}
      >
        <Offcanvas.Header closeButton className="border-bottom pb-3">
          <Offcanvas.Title className="fw-bold">Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="px-0">
          <Nav className="flex-column">
            {menuItems.map((item) => (
              <Nav.Link
                as={Link}
                to={item.path}
                key={item.path}
                className={`px-4 py-3 ${
                  location.pathname === item.path 
                    ? "bg-primary text-white" 
                    : "text-dark hover-bg-light"
                }`}
              >
                <span className="me-3">{item.icon}</span>
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Desktop Sidebar */}
      <div
        className="d-none d-md-block bg-white border-end"
        style={{
          width: "100%", 
          maxWidth: "280px", 
          minHeight: "calc(100vh - 56px)",
          position: "sticky",
          top: "56px"
        }}
      >
        <Nav className="flex-column pt-3">
          {menuItems.map((item) => (
            <Nav.Link
              as={Link}
              to={item.path}
              key={item.path}
              className={`px-4 py-3 ${
                location.pathname === item.path
                  ? "bg-primary text-white"
                  : "text-dark hover-bg-light"
              }`}
            >
              <span className="me-3">{item.icon}</span>
              {item.label}
            </Nav.Link>
          ))}
        </Nav>
      </div>
    </>
  );
}