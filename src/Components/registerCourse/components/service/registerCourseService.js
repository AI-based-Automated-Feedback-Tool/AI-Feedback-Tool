// API service to create a new course
export const saveCourse = async (courseData) => {
    try{
        const response = await fetch('http://localhost:3000/api/registerCourse', {
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