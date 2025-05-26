import { useState, useEffect } from "react";
import { getExamTitles } from "../service/teacherReportsService";

const useFetchExams = (selectedCourse, setGlobalError) => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedCourse) return;
        setLoading(true);

        getExamTitles(selectedCourse)
            .then(data => {
                setExams(data);
            })
            .catch(error => {
                setGlobalError(error.message || "Failed to fetch exam titles");
            })
            .finally(() => setLoading(false));
    }, [selectedCourse]);
    return { exams, loading };
}
export default useFetchExams;