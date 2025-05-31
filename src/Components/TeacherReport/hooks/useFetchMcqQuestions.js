import { useState, useEffect } from "react";
import { getMcqQuestions } from "../service/teacherReportsService";

const useFetchExamSubmissions = (selectedExam, setGlobalError) => {
    const [mcqQuestions, setMcqQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedExam) {
            setMcqQuestions([]);
            setLoading(false);
        return;
        }
        setLoading(true);

        getMcqQuestions(selectedExam)
            .then(data => {
                setMcqQuestions(data);
            })
            .catch(error => {
                setGlobalError(error.message || "Failed to fetch exam submissions");
            })
            .finally(() => setLoading(false));
    }, [selectedExam]);
    return { mcqQuestions, loading };
}
export default useFetchExamSubmissions;