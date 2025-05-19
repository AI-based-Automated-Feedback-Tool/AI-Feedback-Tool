import React from "react";

const AssignmentCard = ({ title,type,due, onStart }) => {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column justify-content-between">
        <h5 className="card-title">{title}</h5>
        <p className="card-text text-muted">📘 Type: {type}</p>
        <p className="card-text text-muted">📅 Due: {due}</p>
        <button className="btn btn-primary mt-auto" onClick={onStart}>
          Start
        </button>
      </div>
    </div>
  );
};

export default AssignmentCard;
