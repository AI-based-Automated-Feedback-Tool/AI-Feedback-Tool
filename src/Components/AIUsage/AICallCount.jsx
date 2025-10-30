import { useAICallUsage } from "./hooks/useAICallUsage";

export default function AICallCount() {
    const {
        usageCount,
        loading,
        errorAICallUsage
    } = useAICallUsage();

    if (loading) {
        return <div>Loading AI usage count...</div>;
    }
    if (errorAICallUsage) {
        return <div>Unable to fetch AI usage count.</div>;
    }

  return (
    <div>
        <h3>AI Usage Today</h3>
        <ul>
            {Object.entries(usageCount).map(([model, count]) => (
                <li key={model}>
                    <strong>{model}</strong>: {count} / 5
                </li>
            ))}
        </ul>
    </div>
  )
}
