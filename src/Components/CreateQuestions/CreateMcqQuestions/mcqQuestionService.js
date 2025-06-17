export const saveMcqQuestion = async (questionData) => {
    try{
        const response = await fetch('http://localhost:3000/api/createQuestions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
        })

        if (!response.ok) {
            const error = await response.json();
            console.log( error);
            throw new Error(error.message || 'Failed to save question');
        }
        return await response.json();
    } catch (err) {
    console.error('saveMcqQuestion error:', err);
    throw err;
    }
    
}