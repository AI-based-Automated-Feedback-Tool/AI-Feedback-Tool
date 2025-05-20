import React from 'react';
import LogOut from '../LogOut';

const TeacherDashboard = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-primary">Welcome to Your Teacher Dashboard</h1>
      <p>This is where Teacher can add Exams.</p>
      <LogOut/>
    </div>
  );
};

export default TeacherDashboard;
