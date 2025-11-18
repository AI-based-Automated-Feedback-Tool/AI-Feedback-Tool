import { supabase } from "../../../../SupabaseAuth/supabaseClient";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// API service to generate mcq questions using AI
export const generateMcqQuestion = async (params) => {
    try {
        // Get the current user's token
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;

        const response = await fetch(`${API_BASE_URL}/api/generate-questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            let errorMessage = 'Failed to generate question';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (err) {
                // fallback if server did not return JSON
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('Error generating MCQ question:', error);
        throw error;
    }
}

