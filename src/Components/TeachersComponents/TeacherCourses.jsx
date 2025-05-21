// TeacherCourses.js – Step 1: Frontend design only

import React from "react";
import "../../css/Courses.css";

const TeacherCourses = () => {
  return (
    <div className="container mt-3">
      <h4 className="mb-4">Welcome to Teacher Dashboard</h4>

      <div className="card shadow p-4">
        <div className="card-header d-flex align-items-center">
          <i className="fas fa-book fa-2x me-3 text-primary"></i>
          <h2 className="mb-0">Courses</h2>
        </div>
        <div className="card-body">
          <div className="row mt-3">
            {/* Placeholder course card */}
            <div className="col-md-4 col-sm-6 col-12 mb-4">
              <div className="card h-100 shadow">
                <div
                  className="card-header text-white text-center"
                  style={{
                    backgroundColor: "#007bff",
                    height: "60px",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Sample Course
                </div>
                <div className="card-body">
                  <h6 className="text-muted" style={{ fontSize: "0.85rem" }}>
                    Course Code: CODE101
                  </h6>
                  <p className="card-text mt-2">
                    This is a sample course description.
                  </p>
                </div>
              </div>
            </div>
            {/* /Placeholder */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCourses;
