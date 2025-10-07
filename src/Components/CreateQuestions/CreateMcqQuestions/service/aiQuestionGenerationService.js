// API service to generate mcq questions using AI
export const generateMcqQuestion = async (params) => {
    try {
        const response = await fetch('http://localhost:3000/api/generate-questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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

