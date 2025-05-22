import React from "react";
import { Offcanvas, Nav } from "react-bootstrap";
import LogOut from "../LogOut";
import { Link } from "react-router-dom";

const StudentSideBar = ({ show, onHide }) => {
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
            <i className="fas fa-tachometer-alt me-2"></i> Dashboard
          </a>

          {/*nav link*/}
          <Nav className="flex-column">
            <Nav.Item>
              <Link
                className="nav-link text-white d-flex align-items-center mb-2"
                to="/student/courses/:userId/profile"
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
          <i className="fas fa-tachometer-alt me-2"></i> Dashboard
        </a>

        {/*nav link*/}
        <ul className="nav flex-column w-100">
          <li className="nav-item mb-2">
            <Link
              className="nav-link text-white d-flex align-items-center"
              to="/student/courses/:userId/profile"
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
