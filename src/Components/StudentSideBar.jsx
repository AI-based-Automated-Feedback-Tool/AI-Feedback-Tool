import React from "react";
import LogOut from "./LogOut";

const StudentSideBar = () => {
  return (
    <nav
      className="navbar navbar-expand-lg flex-column vh-100 p-3"
      style={{
        width: "250px",
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
        color: "white",
      }}
    >
      {/*Logo */}
      <a
        className="navbar-brand text-white mb-4 d-flex align-items-center"
        href="#"
        style={{ fontSize: "1.5rem", fontWeight: "bold" }}
      >
        <i className="fas fa-tachometer-alt me-2"></i> Dashboard
      </a>

      {/*nav links */}
      <ul className="nav flex-column w-100">
        <li className="nav-item mb-2">
          <a
            className="nav-link text-white d-flex align-items-center"
            href="/courses"
            style={{ fontSize: "1.2rem" }}
          >
            <i className="fas fa-book me-2"></i> Courses
          </a>
        </li>
        <li className="nav-item mb-2">
          <a
            className="nav-link text-white d-flex align-items-center"
            href="#"
            style={{ fontSize: "1.2rem" }}
          >
            <i className="fas fa-user me-2"></i> Profile
          </a>
        </li>
      </ul>

      {/*logout btn*/}
      <div className="mt-auto">
        <LogOut />
      </div>
    </nav>
  );
};

export default StudentSideBar;