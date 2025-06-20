import { useState, useEffect } from "react";
import { getEssayQuestions } from "../service/teacherReportsService";

const useFetchEssayQuestions = (selectedExam, setGlobalError) => {
    const [essayQuestions, setEssayQuestions] = useState([]);
    const [loadingEssay, setLoadingEssay] = useState(false);

    useEffect(() => {
        if (!selectedExam) {
            setEssayQuestions([]);
            setLoadingEssay(false);
            return;
        }
        setLoadingEssay(true);

        getEssayQuestions(selectedExam)
            .then(data => {
                setEssayQuestions(data);
            })
            .catch(error => {
                setGlobalError(error.message || "Failed to fetch essay questions");
            })
            .finally(() => setLoadingEssay(false));
    }, [selectedExam]);

    return { essayQuestions, loadingEssay };
}
export default useFetchEssayQuestions;