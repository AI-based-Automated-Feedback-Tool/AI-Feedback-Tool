import React, { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ExamContext } from "../../Context/examContext";
import AssignmentCard from "./AssignmentCard";

const ExamsPage = () => {
  //extract course id
  const { courseId, userId } = useParams();
  const navigate = useNavigate();
  //destructure from exam contexr
  const { pendingExams, completedExams, fetchExams, loading, error } =
    useContext(ExamContext);

  //fetch exam whenever course id changes
  useEffect(() => {
    fetchExams(courseId);
  }, [courseId, fetchExams]);
  
  //navigate to task page only if current time >= start_time
  const handleStart = (exam) => {
    const currentTime = new Date();
    const startTime = new Date(exam.start_time);

    //ensure both times are compared correctly
    if (currentTime.getTime() >= startTime.getTime()) {
      navigate(`/dashboard/task/${exam.exam_id}`);
    } else {
      alert("You cannot start this exam yet. Please wait until the start time.");
    }
  };

  //navigate to review page for completed exams
  const handleReview = (examId) => navigate(`/student/courses/${userId}/${courseId}/exams/reviews`);

  if (loading) return <p>Loading exams...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container py-4">
      <h3>🧪 Exams for Course ID: {courseId}</h3>

      <h5 className="mt-4 text-primary">Pending Exams</h5>
      <div className="row">
        {pendingExams.map((exam) => (
          <div className="col-md-4" key={exam.exam_id}>
            <AssignmentCard
              title={exam.title}
              type={exam.type}
              due={exam.duration}
              startTime={exam.start_time}
              endTime={exam.end_time}
              status="pending"
              onStart={() => handleStart(exam)}
            />
          </div>
        ))}
      </div>

      <h5 className="mt-5 text-success">Completed Exams</h5>
      <div className="row">
        {completedExams.map((exam) => (
          <div className="col-md-4" key={exam.exam_id}>
            <AssignmentCard
              title={exam.title}
              type={exam.type}
              due={exam.duration}
              startTime={exam.start_time}
              endTime={exam.end_time}
              status="completed"
              onReview={() => handleReview(exam.exam_id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamsPage;
