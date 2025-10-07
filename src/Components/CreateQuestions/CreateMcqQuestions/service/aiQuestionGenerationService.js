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
            const error = await response.json();
            console.log(error);
            throw new Error(error.message || 'Failed to generate question');
        }
        return await response.json();
    } catch (error) {
        console.error('Error generating MCQ question:', error);
        throw error;
    }
}

