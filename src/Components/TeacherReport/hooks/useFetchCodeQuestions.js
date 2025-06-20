import { useState, useEffect } from "react";
import { getCodeQuestions } from "../service/teacherReportsService";

const useFetchCodeQuestions = (selectedExam, setGlobalError) => {
    const [codeQuestions, setCodeQuestions] = useState([]);
    const [loadingCode, setLoadingCode] = useState(false);

    useEffect(() => {
        if (!selectedExam) {
            setCodeQuestions([]);
            setLoadingCode(false);
            return;
        }
        setLoadingCode(true);

        getCodeQuestions(selectedExam)
            .then(data => {
                setCodeQuestions(data);
            })
            .catch(error => {
                setGlobalError(error.message || "Failed to fetch code questions");
            })
            .finally(() => setLoadingCode(false));
    }, [selectedExam]);

    return { codeQuestions, loadingCode };
}
export default useFetchCodeQuestions;