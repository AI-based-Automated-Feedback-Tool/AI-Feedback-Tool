//Api service to fetch exam details
export const getExamDetails = async (examId) => {
    if (!examId) {
        throw new Error("Exam selection is required");
    }
    const res = await fetch(`http://localhost:3000/api/examDetails?examId=${examId}`)
    const json = await res.json();
    if (res.ok){
        return json.examDetails;
    }
    else {
        throw new Error(json.message || "Failed to fetch exam details");
    }
}