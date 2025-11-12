import { useEffect, useState } from "react";
import { supabase } from "../../../SupabaseAuth/supabaseClient";
import { fetchAiUsage } from "../service/aiUsageService";

export function useAICallUsage() {
    const [usageCount, setUsageCount] = useState(null);
    const [loadingAICount, setLoadingAICount] = useState(true);
    const [errorAICallUsage, setErrorAICallUsage] = useState(null);

    const loadCount = async () => {
        try {
            setLoadingAICount(true);
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            const count = await fetchAiUsage(token);
            setUsageCount(count);
        } catch (error) {
            console.error("Error fetching AI usage count:", error);
            setErrorAICallUsage("Failed to load AI usage count");
        } finally {
            setLoadingAICount(false);
        }
    }

    useEffect(() => {
        loadCount();
    }, []);

    return { usageCount, loadingAICount, errorAICallUsage, loadCount };
}
