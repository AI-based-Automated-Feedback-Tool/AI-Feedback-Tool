import { useState, useEffect } from "react";
import { getSubmittedAnswers } from "../service/teacherReportsService";
import { getSubmittedCodeAnswers } from "../service/teacherReportsService";
import { getSubmittedEssayAnswers } from "../service/teacherReportsService";

const useFetchSubmittedExamAnswers = (submissionId, examType, setGlobalError) => {
    const [submittedAnswers, setSubmittedAnswers] = useState([]);
    const [loadingAnswers, setLoadingAnswers] = useState(false);

    useEffect(() => {
        if (!submissionId || submissionId.length === 0) {
            setSubmittedAnswers([]);
            setLoadingAnswers(false);
            return;
        }
        setLoadingAnswers(true);

        submissionId.forEach(id => {
            if (examType === "code") {
                getSubmittedCodeAnswers(id)
                    .then(data => {
                        setSubmittedAnswers(prevAnswers => [...prevAnswers, ...data]);
                    })
                    .catch(error => {
                        setGlobalError(error.message || "Failed to fetch code exam submissions");
                    })
                    .finally(() => setLoadingAnswers(false));
                return;
            } else if (examType === "mcq") {
                getSubmittedAnswers(id)
                    .then(data => {
                        setSubmittedAnswers(prevAnswers => [...prevAnswers, ...data]);
                    })
                    .catch(error => {
                        setGlobalError(error.message || "Failed to fetch MCQ exam submissions");
                    })
                    .finally(() => setLoadingAnswers(false));
                return;
            } else if (examType === "essay") {
                getSubmittedEssayAnswers(id)
                    .then(data => {
                        setSubmittedAnswers(prevAnswers => [...prevAnswers, ...data]);
                    })
                    .catch(error => {
                        setGlobalError(error.message || "Failed to fetch essay exam submissions");
                    })
                    .finally(() => setLoadingAnswers(false));
                return;
            }
        });
    }, [submissionId]);
    
    return { submittedAnswers, loadingAnswers };
    
}
export default useFetchSubmittedExamAnswers;