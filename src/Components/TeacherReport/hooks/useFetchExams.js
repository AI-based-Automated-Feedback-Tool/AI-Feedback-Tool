import { useState, useEffect } from "react";
import { getExamTitles } from "../service/teacherReportsService";

const useFetchExams = (selectedCourse, setGlobalError) => {
    const [exams, setExams] = useState([]);
    const [loadingExams, setLoadingExams] = useState(false);

    useEffect(() => {
        if (!selectedCourse) return;
        setLoadingExams(true);

        getExamTitles(selectedCourse)
            .then(data => {
                setExams(data);
            })
            .catch(error => {
                setGlobalError(error.message || "Failed to fetch exam titles");
            })
            .finally(() => setLoadingExams(false));
    }, [selectedCourse]);
    return { exams, loadingExams };
}
export default useFetchExams;