import React, { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ExamContext } from "../../Context/examContext";
import AssignmentCard from "./AssignmentCard";
import { CourseContext } from "../../Context/courseContext";

const ExamsPage = () => {
  //extract course id
  const { courseId, userId } = useParams();
  const navigate = useNavigate();
  //destructure from exam context
  const {
    pendingExams,
    completedExams,
    fetchExams,
    loading,
    error,
    submissionIds,
  } = useContext(ExamContext);
  //destructure course context to get course title
  const { enrolledCourses, fetchEnrolledCourses } = useContext(CourseContext);

  //fetch exam whenever course id changes
  useEffect(() => {
    fetchExams(courseId);
  }, [courseId, fetchExams]);
  //to fetch title
  useEffect(() => {
    if (userId) {
      fetchEnrolledCourses(userId);
    }
  }, [userId, fetchEnrolledCourses]);

  //fun to determine the status of an exam
  const getExamStatus = (exam) => {
    const currentTime = new Date();
    const startTime = new Date(exam.start_time);
    const endTime = new Date(exam.end_time);

    if (currentTime > endTime) {
      return "closed"; //exam has ended
    } else if (currentTime >= startTime && !exam.isTaken) {
      return "open"; //exam is ongoing or ready to be taken
    }
    return "pending"; //exam is scheduled but not yet started
  };

  //navigate to task page only if current time >= start_time
  const handleStart = (exam) => {
    const currentTime = new Date();
    const startTime = new Date(exam.start_time);
    const endTime = new Date(exam.end_time);

    if (currentTime >= startTime && currentTime <= endTime) {
      if (exam.type === "mcq") {
        navigate(`/dashboard/task/${exam.exam_id}`);
      } else if (exam.exam_type === "code") {
        navigate(`/dashboard/code/${exam.exam_id}`);
      } else {
        alert("Unknown exam type.");
      }
    } else if (currentTime > endTime) {
      alert("The exam has ended.");
    } else {
      alert("Exam hasn't started yet.");
      console.log("Exam hasn't started yet.");
    }
  };

  //navigate to review page for completed exams
  const handleReview = (examId) => {
    console.log("submissionIds:", submissionIds);
    console.log("examId:", examId);

    const submissionId = submissionIds[examId];

    if (submissionId) {
      navigate(
        `/student/courses/${userId}/${courseId}/exams/reviews/${submissionId}`
      );
    } else {
      alert("Submission ID not found for this exam.");
      console.log("Submission ID not found for examId:", examId);
    }
  };

  if (loading) return <p>Loading exams...</p>;
  if (error) return <p>{error}</p>;

  //find course title based on course id
  const courseTitle =
    enrolledCourses.find(
      (course) => String(course.course_id) === String(courseId)
    )?.title || "Loading course...";

  //derive open and closed exams from pendingExams
  const openExams = pendingExams.filter(
    (exam) => getExamStatus(exam) === "open"
  );
  const closedExams = pendingExams.filter(
    (exam) => getExamStatus(exam) === "closed"
  );

  console.log("courseId:", courseId);
  console.log("enrolledCourses:", enrolledCourses);

  return (
    <div className="container py-4">
      <h3> 🧪 Exams for Course: {courseTitle}</h3>

      {openExams.length > 0 && (
        <>
          <h5 className="mt-4 text-primary">Open Exams</h5>
          <div className="row">
            {openExams.map((exam) => (
              <div className="col-md-4" key={exam.exam_id}>
                <AssignmentCard
                  title={exam.title}
                  type={exam.type}
                  due={exam.duration}
                  startTime={exam.start_time}
                  endTime={exam.end_time}
                  status="open"
                  onStart={() => handleStart(exam)}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {closedExams.length > 0 && (
        <>
          <h5 className="mt-5 text-danger">Closed Exams</h5>
          <div className="row">
            {closedExams.map((exam) => (
              <div className="col-md-4" key={exam.exam_id}>
                <AssignmentCard
                  title={exam.title}
                  type={exam.type}
                  due={exam.duration}
                  startTime={exam.start_time}
                  endTime={exam.end_time}
                  status="closed"
                  onStart={() => handleStart(exam)}
                />
              </div>
            ))}
          </div>
        </>
      )}
      {completedExams.length > 0 && (
        <>
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
        </>
      )}

      {/*fallback message when no exams are available */}
      {pendingExams.length === 0 &&
        !pendingExams.some((exam) => getExamStatus(exam) === "closed") &&
        completedExams.length === 0 && (
          <p className="mt-5 text-center text-muted">No exam is added.</p>
        )}
    </div>
  );
};

export default ExamsPage;
