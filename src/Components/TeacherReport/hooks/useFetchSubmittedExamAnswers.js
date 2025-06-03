import { useState, useEffect } from "react";
import { getSubmittedAnswers } from "../service/teacherReportsService";

const useFetchSubmittedExamAnswers = (submissionId, setGlobalError) => {
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
            getSubmittedAnswers(id)
                .then(data => {
                setSubmittedAnswers(prevAnswers => [...prevAnswers, ...data]);
            })
            .catch(error => {
                setGlobalError(error.message || "Failed to fetch exam submissions");
            })
            .finally(() => setLoadingAnswers(false));
        });
    }, [submissionId]);

    return { submittedAnswers, loadingAnswers };
}
export default useFetchSubmittedExamAnswers;