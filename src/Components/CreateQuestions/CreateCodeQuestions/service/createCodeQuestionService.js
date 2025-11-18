import { supabase } from "../../../../SupabaseAuth/supabaseClient";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

//API service to fetch programming languages
export const getLanguages = async () => {
    const res = await fetch(`${API_BASE_URL}/api/createCodeQuestions/languages`);
    const data = await res.json();
    if (res.ok) {
        return data.languages;
    } else {
        throw new Error(data.message || "Failed to fetch languages");
    }
}

// API service to create a new code question
export const createCodeQuestion = async (questionData) => {
    try{
        const response = await fetch(`${API_BASE_URL}/api/createCodeQuestion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(questionData),
        });

        if (!response.ok) {
            const error = await response.json();
            console.log(error);
            throw new Error(error.message || 'Failed to save question');
        }
        return await response.json();
    } catch (err) {
        console.log("Attempting to save questions for exam:", examId);
        console.error('createCodeQuestion error:', err);
        throw err;
    }
}

// API service to generate code questions using AI
export const generateCodeQuestion = async (params) => {
    try {
        // Get the current user's token
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;

        const response = await fetch(`${API_BASE_URL}/api/generate-code-questions`, {
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
        console.error('Error generating Code question:', error);
        throw error;
    }
}

