//API service to fetch programming languages
export const getLanguages = async () => {
    const res = await fetch(`http://localhost:3000/api/createCodeQuestions/languages`);
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
        const response = await fetch('http://localhost:3000/api/createCodeQuestion', {
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