import React, { useState } from "react";
import StudentSideBar from "./StudentSideBar";
import { Outlet } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

const StudentLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="d-flex">
      {/* Toggle icon for mobile */}
      <i
        className="fas fa-bars fa-2x text-primary d-lg-none fixed-icon mt-4 icon-with-bg"
        style={{ cursor: "pointer" }}
        onClick={() => setShowSidebar(true)}
      ></i>

      <StudentSideBar show={showSidebar} onHide={() => setShowSidebar(false)} />

      {/* Main content area */}
      <div className="container mt-2">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;
