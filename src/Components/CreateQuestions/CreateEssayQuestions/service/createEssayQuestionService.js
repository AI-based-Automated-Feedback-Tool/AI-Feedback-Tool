export const uploadAttachment = async (file) => {
    try{
        const formData = new FormData();
        formData.append('file', file);

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