import React from "react";

const AssignmentCard = ({ title,type,due, onStart, onReview, status, startTime,
  endTime,}) => {
    //format the timestamp
    const formattedStart = startTime ? new Date(startTime).toLocaleString() : "N/A";
  const formattedEnd = endTime ? new Date(endTime).toLocaleString() : "N/A";
  return (
    <div className="card h-100 shadow-lg rounded ">
      <div className="card-body d-flex flex-column justify-content-between p-4">
        <h5 className="card-title">{title}</h5>
        <p className="card-text text-muted">📘 Type: {type}</p>
        <p className="card-text text-muted">📅 Duration: {due}</p>
        <p className="card-text text-muted">⏰ Start: {formattedStart}</p>
        <p className="card-text text-muted">⏳ End: {formattedEnd}</p>
        <div className="mt-auto text-center">
        {status === "open" && (
          <button className="btn btn-primary mt-auto" onClick={onStart}>
            Start
          </button>
        )}
          {status === "closed" && (
          <button className="btn btn-danger mt-auto" onClick={onStart}>
            Closed
          </button>
        )}
        {status === "completed" && (
          <button className="btn btn-success mt-auto" onClick={onReview}>
            Review
          </button>
        )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
