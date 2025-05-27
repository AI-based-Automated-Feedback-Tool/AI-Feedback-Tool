import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import StudentSideBar from "./StudentSideBar";
import { Outlet } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

const StudentLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  // Retrieve userId from location state or route params
  const location = useLocation();
  const { userId: userIdFromParams } = useParams();
  const userId = location.state?.userId || userIdFromParams;

  if (!userId) {
    console.error(
      "User ID is undefined. Ensure it is passed in the route or state."
    );
  }

  console.log("User ID in StudentLayout:", userId);

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
      <div className="main-content flex-grow-1 p-3">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;
