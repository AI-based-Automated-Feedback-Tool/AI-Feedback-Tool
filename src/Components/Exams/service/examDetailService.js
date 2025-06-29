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

// Api service to edit exam details
export const editExamDetails = async (examData) => {
    if (!examData || !examData.exam_id) {
        throw new Error("Exam ID is required");
    }
    const res = await fetch('http://localhost:3000/api/editExamDetails', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(examData),
    });
    const json = await res.json();
    if (res.ok) {
        return json.updatedExamDetails;
    } else {
        throw new Error(json.message || "Failed to edit exam details");
    }
}