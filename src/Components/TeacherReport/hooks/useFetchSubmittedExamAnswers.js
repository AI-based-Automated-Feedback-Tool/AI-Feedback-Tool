import { useState, useEffect } from "react";
import { getExamSubmissions } from "../service/teacherReportsService";

const useFetchSubmittedExamAnswers = (submissionId, setGlobalError) => {
    const [submittedAnswers, setSubmittedAnswers] = useState([]);
    const [loadingAnswers, setLoadingAnswers] = useState(false);

    submissionId.forEach(id => {
        useEffect(() => {
            if (!id) {
                setSubmittedAnswers([]);
                setLoadingAnswers(false);
                return;
            }
            setLoadingAnswers(true);

        getExamSubmissions(id)
            .then(data => {
                setSubmittedAnswers(prevAnswers => [...prevAnswers, ...data]);
            })
            .catch(error => {
                setGlobalError(error.message || "Failed to fetch exam submissions");
            })
            .finally(() => setLoadingAnswers(false));
        }, [id]);
    })
    return { submittedAnswers, loadingAnswers  };
}
export default useFetchSubmittedExamAnswers;