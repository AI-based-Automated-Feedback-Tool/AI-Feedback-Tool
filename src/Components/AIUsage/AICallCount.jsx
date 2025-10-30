import { useAICallUsage } from "./hooks/useAICallUsage";
import { Badge } from "react-bootstrap";


export default function AICallCount() {
    const {
        usageCount,
        loading,
        errorAICallUsage
    } = useAICallUsage();

    const DAILY_LIMIT = 5;

    if (loading) {
        return <div>Loading AI usage count...</div>;
    }
    if (errorAICallUsage) {
        return <div>Unable to fetch AI usage count.</div>;
    }

    return (
        <div className="text-light small mt-2 text-center">
            <h6 className="fw-semibold mb-2">⚡ AI Usage Today</h6>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
                {Object.entries(usageCount).map(([model, count]) => {
                    const percentage = (count / DAILY_LIMIT) * 100;
                    let variant = "success";
                    if (percentage >= 80) variant = "danger";
                    else if (percentage >= 50) variant = "warning";

                    return (
                        <div key={model} className="text-capitalize">
                            <strong>{model}</strong>{" "}
                            <Badge bg={variant} pill>
                                {count}/{DAILY_LIMIT}
                            </Badge>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
