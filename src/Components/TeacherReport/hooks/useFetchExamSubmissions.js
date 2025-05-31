import { useState, useEffect } from "react";
import { getExamSubmissions } from "../service/teacherReportsService";

const useFetchExamSubmissions = (selectedExam, setGlobalError) => {
    const [examSubmissions, setExamSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedExam) {
            setExamSubmissions([]);
            setLoading(false);
        return;
        }
        setLoading(true);

        getExamSubmissions(selectedExam)
            .then(data => {
                setExamSubmissions(data);
            })
            .catch(error => {
                setGlobalError(error.message || "Failed to fetch exam submissions");
            })
            .finally(() => setLoading(false));
    }, [selectedExam]);
    return { examSubmissions, loading };
}
export default useFetchExamSubmissions;