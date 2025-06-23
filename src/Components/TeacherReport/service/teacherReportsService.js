//API service to fetch courses
export const getCourses = async (userId) => {
    const res = await fetch(`http://localhost:3000/api/teacher/reports/course?userId=${userId}`);
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
    const res = await fetch(`http://localhost:3000/api/teacher/reports/exams?course_id=${selectedCourse}`)
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
    const res = await fetch(`http://localhost:3000/api/teacher/reports/students?course_id=${selectedCourse}`)
    const json = await res.json();
    if (res.ok){
        return json.students;
    }
    else {
        throw new Error(json.message || "Failed to fetch students");
    }
}

//API service to fetch exam submissions
export const getExamSubmissions = async (selectedExam) => {    
    if (!selectedExam) {
        throw new Error("Exam selection is required");
    }        
    const res = await fetch(`http://localhost:3000/api/teacher/reports/exam_submission?examId=${selectedExam}`)
    const json = await res.json();
    if (res.ok){
        return json.examSubmissions;
    }
    else {
        throw new Error(json.message || "Failed to fetch exam submissions");
    }
}

//API service to fetch mcq questions
export const getMcqQuestions = async (selectedExam) => {    
    if (!selectedExam) {
        throw new Error("Exam selection is required");
    }        
    const res = await fetch(`http://localhost:3000/api/teacher/reports/mcq?examId=${selectedExam}`)
    const json = await res.json();
    if (res.ok){
        return json.mcqQuestions;
    }
    else {
        throw new Error(json.message || "Failed to fetch mcq questions");
    }
}

//API service to fetch submitted answer details
export const getSubmittedAnswers = async (submissionId) => {    
    if (!submissionId) {
        throw new Error("Submission ID is required");
    }        
    const res = await fetch(`http://localhost:3000/api/teacher/reports/submitted_answers?submissionId=${submissionId}`)
    const json = await res.json();
    if (res.ok){
        return json.submittedAnswers;
    }
    else {
        throw new Error(json.message || "Failed to fetch submitted answers");
    }
}

//Api service to fetch code questions
export const getCodeQuestions = async (selectedExam) => {
    if (!selectedExam) {
        throw new Error("Exam selection is required");
    }
    const res = await fetch(`http://localhost:3000/api/teacher/reports/code_questions?examId=${selectedExam}`)
    const json = await res.json();
    if (res.ok){
        return json.codeQuestions;
    }
    else {
        throw new Error(json.message || "Failed to fetch code questions");
    }
}

//API service to fetch submitted code answers
export const getSubmittedCodeAnswers = async (submissionId) => {
    if (!submissionId) {
        throw new Error("Submission ID is required");
    }
    const res = await fetch(`http://localhost:3000/api/teacher/reports/submitted_code_answers?submissionId=${submissionId}`)
    const json = await res.json();
    if (res.ok){
        return json.submittedAnswers;
    }
    else {
        throw new Error(json.message || "Failed to fetch submitted code answers");
    }
}

//Api service to fetch essay questions
export const getEssayQuestions = async (selectedExam) => {
    if (!selectedExam) {
        throw new Error("Exam selection is required");
    }
    const res = await fetch(`http://localhost:3000/api/teacher/reports/essay_questions?examId=${selectedExam}`)
    const json = await res.json();
    if (res.ok){
        return json.essayQuestions;
    }
    else {
        throw new Error(json.message || "Failed to fetch essay questions");
    }
}

//Api service to fetch submitted essay answers
export const getSubmittedEssayAnswers = async (submissionId) => {
    if (!submissionId) {
        throw new Error("Submission ID is required");
    }
    const res = await fetch(`http://localhost:3000/api/teacher/reports/submitted_essay_answers?submissionId=${submissionId}`)
    const json = await res.json();
    if (res.ok){
        return json.submittedAnswers;
    }
    else {
        throw new Error(json.message || "Failed to fetch submitted essay answers");
    }
}

//Api service to fetch data for student specific report
export const getStudentReportData = async (examId, studentId, examType) => {
    if (!examId || !studentId || !examType) {
        throw new Error("Exam ID, Student ID, and Exam Type are required");
    }
    const res = await fetch(`http://localhost:3000/api/teacher/reports/student_exam_details?examId=${examId}&studentId=${studentId}&examType=${examType}`)
    const json = await res.json();
    if (res.ok){
        return json.submittedAnswers;
    }
    else {
        throw new Error(json.message || "Failed to fetch student report data");
    }
}


            