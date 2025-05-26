import React from "react";
import { Offcanvas, Nav } from "react-bootstrap";
import LogOut from "../LogOut";
import { Link, useLocation } from "react-router-dom";
import "../../css/studentSideBar.css";
import { UserContext } from "../../Context/userContext";
import { useContext, useEffect } from "react";

const StudentSideBar = ({ show, onHide }) => {
  const { userId, setUserId } = useContext(UserContext);
  //get the current route
  const location = useLocation();

  //fun to check if a route is active
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, [setUserId]);


  return (
    <>
      {/*for mobile*/}
      <Offcanvas
        show={show}
        onHide={onHide}
        className="d-lg-none"
        style={{
          width: "250px",
          background: "linear-gradient(135deg, #6a11cb, #2575fc)",
          color: "white",
        }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="text-white">Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/*logo */}
          <a
            className="navbar-brand text-white mb-4 d-flex align-items-center"
            href="#"
            style={{ fontSize: "1.5rem", fontWeight: "bold" }}
          >
            AI Feedback Tool
          </a>

          {/*nav link*/}
          <Nav className="flex-column">
            <Nav.Item>
              <Link
                className={`nav-link d-flex align-items-center ${
                  window.location.pathname === `/student/courses/${userId}`
                    ? "active"
                    : "text-white"
                }`}
                to={`/student/courses/${userId}`}
                style={{ fontSize: "1.2rem" }}
              >
                <i className="fas fa-home me-2"></i> Dashboard
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link
                className={`nav-link d-flex align-items-center ${
                  isActive(`/student/courses/${userId}/results`) ? "active" : "text-white"
                }`}
                to={`/student/courses/${userId}/results`}
                style={{ fontSize: "1.2rem" }}
              >
                <i className="fas fa-chart-bar me-2"></i> Results
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link
                className={`nav-link d-flex align-items-center ${
                  isActive(`/student/courses/${userId}/profile`)
                    ? "active"
                    : "text-white"
                }`}
                to={`/student/courses/${userId}/profile`}
                style={{ fontSize: "1.2rem" }}
              >
                <i className="fas fa-user me-2"></i> Profile
              </Link>
            </Nav.Item>
          </Nav>

          {/*logout btn*/}
          <div className="d-lg-none text-white mt-4 mx-4 ">
            <i className="fas fa-sign-out-alt me-2"></i>
            <LogOut />
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/*for desktop*/}
      <nav
        className="d-none d-lg-flex flex-column vh-100 p-3"
        style={{
          width: "250px",
          background: "linear-gradient(135deg, #6a11cb, #2575fc)",
          color: "white",
        }}
      >
        {/*logo */}
        <a
          className="navbar-brand text-white mb-4 d-flex align-items-center"
          href="#"
          style={{ fontSize: "1.5rem", fontWeight: "bold" }}
        >
          AI Feedback Tool
        </a>

        {/*nav link*/}
        <ul className="nav flex-column w-100">
          <li className="nav-item mb-2">
            <Link
              className={`nav-link d-flex align-items-center ${
                window.location.pathname === `/student/courses/${userId}`
                  ? "active"
                  : "text-white"
              }`}
              to={`/student/courses/${userId}`}
              style={{ fontSize: "1.2rem" }}
            >
              <i className="fas fa-home me-2"></i> Dashboard
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link
              className={`nav-link d-flex align-items-center ${
                isActive(`/student/courses/${userId}/results`) ? "active" : "text-white"
              }`}
              to={`/student/courses/${userId}/results`}
              style={{ fontSize: "1.2rem" }}
            >
              <i className="fas fa-chart-bar me-2"></i> Results
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link
              className={`nav-link d-flex align-items-center ${
                isActive(`/student/courses/${userId}/profile`)
                  ? "active"
                  : "text-white"
              }`}
              to={`/student/courses/${userId}/profile`}
              style={{ fontSize: "1.2rem" }}
            >
              <i className="fas fa-user me-2"></i> Profile
            </Link>
          </li>
        </ul>
        {/*logout btn*/}
        <div className="mt-auto mb-4">
          <i className="fas fa-sign-out-alt me-2"></i>
          <LogOut />
        </div>
      </nav>
    </>
  );
};

export default StudentSideBar;
