import React, { useEffect, useState } from "react";
import { supabase } from "../../SupabaseAuth/supabaseClient";
import AssignmentCard from "./AssignmentCard";

const ExamsPage = () => {
  const [examsByCourse, setExamsByCourse] = useState({});

  useEffect(() => {
    //fetch exam from exams table
    const fetchExams = async () => {
      const { data, error } = await supabase.from("exams").select("*");

      if (error) {
        //log any err
        console.error("Error loading exams:", error);
      } else {
        //group exams by course_code
        const groupedExams = data.reduce((acc, exam) => {
          const { course_code } = exam;
          //initialize array if course code doesnot exist
          if (!acc[course_code]) acc[course_code] = [];
          //add exam to the course code group
          acc[course_code].push(exam);
          return acc;
        }, {});
        //update state with grouped exam
        setExamsByCourse(groupedExams);
      }
    };
//call fun to fetch exam
    fetchExams();
  }, []);

  const handleStart = (id) => {
    console.log(`Starting exam with ID: ${id}`);
  };

  return (
    <div className="container py-4">
      <h3>🧪 Exams by Course</h3>

      {/*pending exams section */}
      <h4 className="text-primary">Pending Exams</h4>
      {Object.keys(examsByCourse).map((courseCode) => (
        <div key={courseCode} className="mb-5">
          <h5 className="text-secondary">Course Code: {courseCode}</h5>
          <div className="row">
            {examsByCourse[courseCode]
              .filter((exam) => !exam.completed)
              .map((exam) => (
                <div className="col-md-4" key={exam.exam_id}>
                  <AssignmentCard
                    title={exam.title}
                    type={exam.type}
                    due={exam.duration}
                    status="pending"
                    onStart={() => handleStart(exam.exam_id)}
                  />
                </div>
              ))}
          </div>
        </div>
      ))}

      {/*completed exams section */}
      <h4 className="text-success mt-5">Completed Exams</h4>
      {Object.keys(examsByCourse).map((courseCode) => (
        <div key={courseCode} className="mb-5">
          <h5 className="text-secondary">Course Code: {courseCode}</h5>
          <div className="row">
            {examsByCourse[courseCode]
              .filter((exam) => exam.completed)
              .map((exam) => (
                <div className="col-md-4" key={exam.exam_id}>
                  <AssignmentCard
                    title={exam.title}
                    type={exam.type}
                    due={exam.duration}
                    status="completed"
                  />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExamsPage;