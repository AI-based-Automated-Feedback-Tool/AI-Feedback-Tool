import React, { useEffect, useState } from "react";
import { useCodeQuestions } from "../../../Context/QuestionsContext/CodeContext";
import "bootstrap/dist/css/bootstrap.min.css";

const CodeQuestionsList = () => {
  //fetch questions and message from the context
  const { fetchCodeQuestions, questions = [], message } = useCodeQuestions();
  
  //to store student answers for each question
  const [studentAnswers, setStudentAnswers] = useState({});

  //fetch code questions when the component is mounted
  useEffect(() => {
    fetchCodeQuestions();
  }, [fetchCodeQuestions]);

  //handle changes in the student code input
  const handleChange = (id, code) => {
    setStudentAnswers((prev) => ({ ...prev, [id]: code }));
  };

  //handle submission of a student's answer for a specific question
  const handleSubmit = (id) => {
    const answer = studentAnswers[id];
    console.log("Submitting answer for question", id, answer);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Practice Code Questions</h1>
      
      {/*display message if available */}
      {message && <div className="alert alert-info">{message}</div>}

      {/*render questions*/}
      {questions.length > 0 ? (
        <div className="row">
          {questions.map((question, index) => (
            <div className="col-md-12 mb-5" key={question.id || index}>
              <div className="card shadow-sm">
                {/*card header with question number*/}
                <div className="card-header bg-info text-white">
                  <h5 className="card-title mb-0">
                    Question {index + 1}
                  </h5>
                </div>
                <div className="card-body">
                  {/*display question*/}
                  <p><strong>{index + 1})</strong> {question.question_description}</p>                  
                  {/*textarea for student to write their code*/}
                  <label><strong>Your Code:</strong></label>
                  <textarea
                    className="form-control"
                    rows={10}
                    value={
                      studentAnswers[question.id] ||
                      `${question.function_signature || ""}\n\n# Write your code here\n`
                    }
                    onChange={(e) => handleChange(question.id, e.target.value)}
                  ></textarea>

                  {/*display wrapper code for reference if available*/}
                  {question.wrapper_code && (
                    <>
                      <label className="mt-3"><strong>Wrapper Code (for reference):</strong></label>
                      <pre className="bg-light p-3 rounded">{question.wrapper_code}</pre>
                    </>
                  )}

                  {/*submit button for the student's answer*/}
                  <button
                    className="btn btn-success mt-3"
                    onClick={() => handleSubmit(question.id)}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Display message if no questions are available
        <div className="text-center">
          <p className="text-muted">No questions available</p>
        </div>
      )}
    </div>
  );
};

export default CodeQuestionsList;