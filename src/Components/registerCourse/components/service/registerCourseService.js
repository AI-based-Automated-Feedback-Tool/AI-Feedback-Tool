const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// API service to create a new course
export const saveCourse = async (courseData) => {
    try{
        const response = await fetch(`${API_BASE_URL}/api/registerCourse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(courseData),
        });

        let result;
        try {
            result = await response.json();
        } catch (err) {
            throw new Error('Server returned an invalid response format');
    }

        if (!response.ok) {
            throw new Error(result.message || 'Failed to save course');
        }
        return result;
    } catch (err) {
        throw err;
    }
}