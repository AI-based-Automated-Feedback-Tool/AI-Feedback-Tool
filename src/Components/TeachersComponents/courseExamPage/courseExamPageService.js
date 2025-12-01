const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

//API service to delete exam
export const deleteExam = async (examData) => {
    try{
        const response = await fetch(`${API_BASE_URL}/api/delete-exam`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(examData),
        })

        if (!response.ok) {
            const error = await response.json();
            console.log( error);
            throw new Error('Failed to delete exam');
        }
        return await response.json();
    } catch (err) {
    console.error('deleteExam error:', err);
    throw err;
    }
    
}


            