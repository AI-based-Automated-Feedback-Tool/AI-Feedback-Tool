import React from "react";
import { useResults } from "../../Context/ResultContext";
import { Table, Spinner, Badge, Container } from "react-bootstrap";

const Result = () => {
  const { results, loading } = useResults();

  // --- helpers ---

  // Use score_percent when present; otherwise show "N/A (legacy)"
  const renderScoreBadge = (row) => {
    const pct =
      row?.score_percent === null || row?.score_percent === undefined
        ? null
        : Number(row.score_percent);

    if (pct === null || Number.isNaN(pct)) {
      return <Badge bg="secondary">N/A (legacy)</Badge>;
    }
    const bg = pct >= 80 ? "success" : pct >= 50 ? "warning" : "danger";
    return <Badge bg={bg}>{pct}%</Badge>;
  };

  // feedback_summary may be jsonb OR a plain string
  const renderFeedback = (row) => {
    let fb = row?.feedback_summary;

    // Normalize to an object if it is a JSON string
    if (typeof fb === "string") {
      try {
        fb = JSON.parse(fb);
      } catch {
        // plain string -> treat it as a one-line summary
        return fb || "⏳ AI feedback is being generated...";
      }
    }

    if (!fb) return "⏳ AI feedback is being generated...";

    const hasTyped = fb?.mcq || fb?.essay || fb?.code;

    if (hasTyped) {
      return (
        <ul style={{ paddingLeft: "1rem", margin: 0 }}>
          {fb?.mcq && (
            <li>
              <strong>MCQ:</strong> {String(fb.mcq).slice(0, 60)}...
            </li>
          )}
          {fb?.essay && (
            <li>
              <strong>Essay:</strong> {String(fb.essay).slice(0, 60)}...
            </li>
          )}
          {fb?.code && (
            <li>
              <strong>Code:</strong> {String(fb.code).slice(0, 60)}...
            </li>
          )}
        </ul>
      );
    }

    // fall back to a generic summary field if present
    return fb?.summary || "⏳ AI feedback is being generated...";
  };

  // --- render ---

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

                {/* Use score_percent with legacy fallback */}
                <td>{renderScoreBadge(r)}</td>

                {/* time_taken is in seconds -> show minutes */}
                <td>{r.time_taken != null ? Math.round(r.time_taken / 60) : "-"}</td>

                <td>{r.focus_loss_count ?? "-"}</td>

                {/* Robust feedback rendering for jsonb or string */}
                <td>{renderFeedback(r)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Result;
