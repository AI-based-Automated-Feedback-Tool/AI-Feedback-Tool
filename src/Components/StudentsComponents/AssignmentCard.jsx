import React from "react";

const AssignmentCard = ({ title,type,due, onStart, onReview, status, startTime,
  endTime,}) => {
    //format the timestamp
    const formattedStart = startTime ? new Date(startTime).toLocaleString() : "N/A";
  const formattedEnd = endTime ? new Date(endTime).toLocaleString() : "N/A";
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column justify-content-between">
        <h5 className="card-title">{title}</h5>
        <p className="card-text text-muted">📘 Type: {type}</p>
        <p className="card-text text-muted">📅 Duration: {due}</p>
        <p className="card-text text-muted">⏰ Start: {formattedStart}</p>
        <p className="card-text text-muted">⏳ End: {formattedEnd}</p>
        {status === "pending" && (
          <button className="btn btn-primary mt-auto" onClick={onStart}>
            Start
          </button>
        )}
        {status === "completed" && (
          <button className="btn btn-success mt-auto" onClick={onReview}>
            Review
          </button>
        )}
      </div>
    </div>
  );
};

export default AssignmentCard;
