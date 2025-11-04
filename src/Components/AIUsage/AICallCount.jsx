import { useAICallUsage } from "./hooks/useAICallUsage";
import { Badge } from "react-bootstrap";
import '../../css/aiCallCount/AICallCount.css';


export default function AICallCount({ usageCount, loadingAICount, errorAICallUsage }) {
  const DAILY_LIMIT = 5;

  if (loadingAICount) {
      return <div className="ai-usage-loading">Loading AI usage count...</div>;
  }
  if (errorAICallUsage) {
      return <div className="ai-usage-error">Unable to fetch AI usage count.</div>;
  }

  return (
    <div className="d-flex gap-2 flex-wrap justify-content-center">
      {Object.entries(usageCount).map(([model, count]) => {
        const percentage = (count / DAILY_LIMIT) * 100;
        let variant = "success";
        if (percentage >= 80) variant = "danger";
        else if (percentage >= 50) variant = "warning";

        return (
          <div
            key={model}
            className={`ai-usage-badge ${model === "cohere" ? "cohere" : "deepseek"}`}
          >
            <i className="fas fa-robot icon"></i>
            <span className="text-capitalize">{model}</span>
                
            <Badge bg={variant} pill className="ms-1">
              {count}/{DAILY_LIMIT}
            </Badge>
          </div>
        );
      })}
    </div>
  )
}
