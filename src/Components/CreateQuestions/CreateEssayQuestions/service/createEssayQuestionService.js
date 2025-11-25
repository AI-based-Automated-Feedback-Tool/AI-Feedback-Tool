import { supabase } from '../../../../SupabaseAuth/supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const uploadAttachment = async (file) => {
    try{
        const formData = new FormData();
        formData.append('attachment', file);

        const res = await fetch(`${API_BASE_URL}/api/upload`, {
            method: 'POST',
            body: formData
        })
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to upload attachment');
        }
        const data = await res.json();
        return data
    } catch (error) {
        console.error('Error uploading attachment:', error);
        throw error;
    }
}

export const removeAttachment = async (filePath) => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/essayQuestions/delete-attachment`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filePath }),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to remove attachment');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error removing attachment:', error);
        throw error;
    }
}

export const createEssayQuestion = async (questionData) => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/createEssayQuestion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(questionData),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to create essay question');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error creating essay question:', error);
        throw error;
    }
}

//API service to generate essay questions using AI
export const generateEssayQuestion = async (params) => {
    try{
        //Get the current user's token
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;

        const response = await fetch(`${API_BASE_URL}/api/generate-essay-questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            let errorMessage = 'Failed to generate essay question';
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
        console.error('Error generating essay question:', error);
        throw error;
    }
}