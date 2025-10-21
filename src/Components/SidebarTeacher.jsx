import { Nav, Offcanvas } from "react-bootstrap";
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt,
  FaBook,
  FaUsers,
  FaChartBar,
  FaUser,
  FaUniversity
} from "react-icons/fa";
import '../css/pages/TeacherSidebar.css';

export default function SidebarTeacher({ show, onHide }) {
  const location = useLocation();
  
  const menuItems = [
    { path: "/teacher", icon: <FaTachometerAlt />, label: "Dashboard" },
    { path: "/teacher/exams", icon: <FaBook />, label: "Configure Exam" },
    { path: "/teacher/registerCourse", icon: <FaUniversity  />, label: "Register Course" },
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
        className="d-md-none teacher-sidebar"
        style={{ width: "280px" }}
      >
        <Offcanvas.Header closeButton className="border-bottom pb-3">
          <Offcanvas.Title className="fw-bold">Navigation</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="px-0">
          <Nav className="flex-column">
            {menuItems.map((item, index) => (
              <Nav.Link
                as={Link}
                to={item.path}
                key={item.path}
                onClick={onHide}
                className={`nav-link ${
                  location.pathname === item.path ? "active" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Desktop Sidebar */}
      <div
        className="d-none d-md-block teacher-sidebar teacher-sidebar-desktop"
        style={{
          width: "100%", 
          maxWidth: "280px"
        }}
      >
        <Nav className="flex-column">
          {menuItems.map((item, index) => (
            <Nav.Link
              as={Link}
              to={item.path}
              key={item.path}
              className={`nav-link ${
                location.pathname === item.path ? "active" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Nav.Link>
          ))}
        </Nav>
      </div>
    </>
  );
}