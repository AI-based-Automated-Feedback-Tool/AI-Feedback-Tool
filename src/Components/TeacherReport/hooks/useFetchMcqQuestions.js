import { useState, useEffect } from "react";
import { getMcqQuestions } from "../service/teacherReportsService";

const useFetchMcqQuestions = (selectedExam, setGlobalError) => {
    const [mcqQuestions, setMcqQuestions] = useState([]);
    const [loadingMcq, setLoadingMcq] = useState(false);

    useEffect(() => {
        if (!selectedExam) {
            setMcqQuestions([]);
            setLoadingMcq(false);
        return;
        }
        setLoadingMcq(true);

        getMcqQuestions(selectedExam)
            .then(data => {
                setMcqQuestions(data);
            })
            .catch(error => {
                setGlobalError(error.message || "Failed to fetch mcq questions");
            })
            .finally(() => setLoadingMcq(false));
    }, [selectedExam]);
    return { mcqQuestions, loadingMcq };
}
export default useFetchMcqQuestions;