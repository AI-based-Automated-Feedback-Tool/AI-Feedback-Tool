import React, { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ExamContext } from "../../Context/examContext";
import AssignmentCard from "./AssignmentCard";
import { CourseContext } from "../../Context/courseContext";

const ExamsPage = () => {
  const { courseId, userId } = useParams();
  const navigate = useNavigate();

  const {
    pendingExams,
    completedExams,
    fetchExams,
    loading,
    error,
    submissionIds,
  } = useContext(ExamContext);

  const { enrolledCourses, fetchEnrolledCourses } = useContext(CourseContext);

  useEffect(() => {
    fetchExams(courseId);
  }, [courseId, fetchExams]);

  useEffect(() => {
    if (userId) {
      fetchEnrolledCourses(userId);
    }
  }, [userId, fetchEnrolledCourses]);

  // Normalize type: "exam" / "assignment"
  const getKind = (item) =>
    String(item.exam_or_assignment || "exam").toLowerCase().trim();

  const getItemStatus = (item) => {
    const currentTime = new Date();
    const startTime = new Date(item.start_time);
    const endTime = new Date(item.end_time);

    if (currentTime > endTime) return "closed";
    if (currentTime >= startTime) return "open";
    return "pending";
  };

  const handleStart = (item) => {
    const currentTime = new Date();
    const startTime = new Date(item.start_time);
    const endTime = new Date(item.end_time);

    if (currentTime >= startTime && currentTime <= endTime) {
      console.log(
        "Starting:",
        getKind(item),
        "| type:",
        item.type,
        "| id:",
        item.exam_id
      );

      // For now assignment and exam can use same routes.
      // If later you want different routes, change base here.
      const base = "/dashboard";

      if (item.type === "mcq") {
        navigate(`${base}/task/${item.exam_id}`);
      } else if (item.type === "code") {
        navigate(`${base}/code/${item.exam_id}`);
      } else if (item.type === "essay") {
        navigate(`${base}/essay/${item.exam_id}`);
      } else {
        alert("Unknown type.");
      }
    } else if (currentTime > endTime) {
      alert("This has ended.");
    } else {
      alert("This hasn't started yet.");
    }
  };

  const handleReview = (examId) => {
    const submissionId = submissionIds[examId];

    if (submissionId) {
      navigate(
        `/student/courses/${userId}/${courseId}/exams/reviews/${submissionId}`
      );
    } else {
      alert("Submission ID not found for this item.");
    }
  };

  if (loading) return <p>Loading exams/assignments...</p>;
  if (error) return <p>{error}</p>;

  const courseTitle =
    enrolledCourses.find(
      (course) => String(course.course_id) === String(courseId)
    )?.title || "Loading course...";

  // Split pending items by time status
  const openItems = pendingExams.filter((item) => getItemStatus(item) === "open");
  const closedItems = pendingExams.filter(
    (item) => getItemStatus(item) === "closed"
  );

  // Split by kind (exam vs assignment)
  const openExams = openItems.filter((i) => getKind(i) === "exam");
  const openAssignments = openItems.filter((i) => getKind(i) === "assignment");

  const closedExams = closedItems.filter((i) => getKind(i) === "exam");
  const closedAssignments = closedItems.filter((i) => getKind(i) === "assignment");

  const completedOnlyExams = completedExams.filter((i) => getKind(i) === "exam");
  const completedOnlyAssignments = completedExams.filter(
    (i) => getKind(i) === "assignment"
  );

  // Debug (optional)
  // console.log("pending kinds:", pendingExams.map(x => x.exam_or_assignment));

  const renderCards = (items, status, mode) => (
    <div className="row">
      {items.map((item) => (
        <div className="col-md-4" key={item.exam_id}>
          <AssignmentCard
            title={item.title}
            type={item.type}
            due={item.duration}
            startTime={item.start_time}
            endTime={item.end_time}
            status={status}
            onStart={mode === "start" ? () => handleStart(item) : undefined}
            onReview={mode === "review" ? () => handleReview(item.exam_id) : undefined}
          />
        </div>
      ))}
    </div>
  );

  const isEmpty =
    pendingExams.length === 0 && completedExams.length === 0;

  return (
    <div className="container py-4">
      <h3>📚 Course Items: Exams & Assignments — {courseTitle}</h3>

      {/* OPEN EXAMS */}
      {openExams.length > 0 && (
        <>
          <h5 className="mt-4 text-primary">Open Exams</h5>
          {renderCards(openExams, "open", "start")}
        </>
      )}

      {/* OPEN ASSIGNMENTS */}
      {openAssignments.length > 0 && (
        <>
          <h5 className="mt-4 text-primary">Open Assignments</h5>
          {renderCards(openAssignments, "open", "start")}
        </>
      )}

      {/* CLOSED EXAMS */}
      {closedExams.length > 0 && (
        <>
          <h5 className="mt-5 text-danger">Closed Exams</h5>
          {renderCards(closedExams, "closed", "start")}
        </>
      )}

      {/* CLOSED ASSIGNMENTS */}
      {closedAssignments.length > 0 && (
        <>
          <h5 className="mt-5 text-danger">Closed Assignments</h5>
          {renderCards(closedAssignments, "closed", "start")}
        </>
      )}

      {/* COMPLETED EXAMS */}
      {completedOnlyExams.length > 0 && (
        <>
          <h5 className="mt-5 text-success">Completed Exams</h5>
          {renderCards(completedOnlyExams, "completed", "review")}
        </>
      )}

      {/* COMPLETED ASSIGNMENTS */}
      {completedOnlyAssignments.length > 0 && (
        <>
          <h5 className="mt-5 text-success">Completed Assignments</h5>
          {renderCards(completedOnlyAssignments, "completed", "review")}
        </>
      )}

      {isEmpty && (
        <p className="mt-5 text-center text-muted">
          No exam or assignment is added.
        </p>
      )}
    </div>
  );
};

export default ExamsPage;
