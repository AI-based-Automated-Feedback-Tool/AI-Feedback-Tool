// src/Components/ExamsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../SupabaseAuth/supabaseClient";
import AssignmentCard from "./AssignmentCard";

const ExamsPage = () => {
  const { courseId } = useParams();
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .eq("course_code", courseId);

      if (error) console.error("Error loading exams:", error);
      else setExams(data);
    };

    fetchExams();
  }, [courseId]);

  const pending = exams.filter((e) => !e.completed);
  const completed = exams.filter((e) => e.completed);

  const handleStart = (id) => navigate(`/task/${id}`);

  return (
    <div className="container py-4">
      <h3>🧪 Exams for Course ID: {courseId}</h3>

      <h5 className="mt-4 text-primary">Pending Exams</h5>
      <div className="row">
        {pending.map((exam) => (
          <div className="col-md-4" key={exam.id}>
            <AssignmentCard
              title={exam.title}
              due={exam.due_date}
              status="pending"
              onStart={() => handleStart(exam.id)}
            />
          </div>
        ))}
      </div>

      <h5 className="mt-5 text-success">Completed Exams</h5>
      <div className="row">
        {completed.map((exam) => (
          <div className="col-md-4" key={exam.id}>
            <AssignmentCard
              title={exam.title}
              due={exam.due_date}
              status="completed"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamsPage;
