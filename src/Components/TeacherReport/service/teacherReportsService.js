//API service to fetch courses
export const getCourses = async (userId) => {
    const res = await fetch(`http://localhost:5000/api/teacher/reports/course?userId=${userId}`);
    const data = await res.json();
    if (res.ok) {
        return data.courses;
    } else {
        throw new Error(data.message || "Failed to fetch courses");    
    }
}

// API service to fetch exam titles
export const getExamTitles = async (selectedCourse) => {
    if (!selectedCourse) {
        throw new Error("Course ID is required");
    }   
    const res = await fetch(`http://localhost:5000/api/teacher/reports/exams?course_id=${selectedCourse}`)
    const json = await res.json();
    if (res.ok){
        return json.exams;
    }
    else {
        throw new Error(json.message || "Failed to fetch exam titles");
    }
}

// API service to fetch students
export const getStudents = async (selectedCourse) => {    
    if (!selectedCourse) {
        throw new Error("Course ID is required");
    }        
    const res = await fetch(`http://localhost:5000/api/teacher/reports/students?course_id=${selectedCourse}`)
    const json = await res.json();
    if (res.ok){
        return json.students;
    }
    else {
        throw new Error(json.message || "Failed to fetch students");
    }
}

            