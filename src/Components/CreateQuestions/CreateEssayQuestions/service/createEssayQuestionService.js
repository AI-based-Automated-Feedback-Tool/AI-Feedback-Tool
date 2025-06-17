export const uploadAttachment = async (file) => {
    try{
        const formData = new FormData();
        formData.append('attachment', file);

        const res = await fetch(`http://localhost:5000/api/upload`, {
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
        const res = await fetch(`http://localhost:5000/api/essayQuestions/delete-attachment`, {
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
        const res = await fetch(`http://localhost:5000/api/createEssayQuestion`, {
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