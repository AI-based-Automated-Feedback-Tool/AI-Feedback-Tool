import { useEffect, useState } from "react" ;
import { supabase } from "../../supabaseClient";
import { fetchAiUsage } from "../AIUsage/service/aiUsageService";
import { use } from "react";

export default function AICallCount() {
    const [usageCount, setUsageCount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUsageCount = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token;
                const count = await fetchAiUsage(token);
                setUsageCount(count);
            } catch (error) {
                console.error("Error fetching AI usage count:", error);
            } finally {
                setLoading(false);
            }
        };

        getUsageCount();
    }, []);

    if (loading) {
        return <div>Loading AI usage count...</div>;
    }
    if (!usageCount) {
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
