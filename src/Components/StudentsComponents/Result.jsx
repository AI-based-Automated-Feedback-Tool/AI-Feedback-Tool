import React from "react";
import { useResults } from "../../Context/ResultContext";
import { Table, Spinner, Badge, Container } from "react-bootstrap";

const Result = () => {
    //destructure results and loading state
  const { results, loading } = useResults();

  return (
    <Container className="mt-4">
      <h2 className="mb-4">📊 My Results</h2>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : results.length === 0 ? (
        <div className="alert alert-info">No results found.</div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Exam ID</th>
              <th>Submitted At</th>
              <th>Score</th>
              <th>Time Taken (min)</th>
              <th>Focus Losses</th>
              <th>Feedback Summary</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id}>
                <td>{r.exam_id}</td>
                <td>{new Date(r.submitted_at).toLocaleString()}</td>
                <td>
                  <Badge bg={r.total_score >= 50 ? "success" : "danger"}>
                    {r.total_score}%
                  </Badge>
                </td>
                <td>{Math.round(r.time_taken / 60)}</td>
                <td>{r.focus_loss_count}</td>
                <td>  {r.feedback_summary?.mcq || r.feedback_summary?.essay || r.feedback_summary?.code ? (
                     <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                     {r.feedback_summary.mcq && (
                     <li><strong>MCQ:</strong> {r.feedback_summary.mcq.slice(0, 60)}...</li>
                    )}
                     {r.feedback_summary.essay && (
                      <li><strong>Essay:</strong> {r.feedback_summary.essay.slice(0, 60)}...</li>
                  )}
                     {r.feedback_summary.code && (
                     <li><strong>Code:</strong> {r.feedback_summary.code.slice(0, 60)}...</li>
           )} 
                     </ul>
                    ) : (
                      "⏳ AI feedback is being generated..."
      )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Result;
