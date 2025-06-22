import { useState, useEffect } from "react";
import { getStudentReportData } from "../service/teacherReportsService";

const useFetchStudentReportData = (examId, studentId, setGlobalError) => {
    const [studentReportData, setStudentReportData] = useState(null);
    const [loadingStudentReport, setLoadingStudentReport] = useState(false);

    useEffect(() => {
        if (!examId || !studentId) return;
        setLoadingStudentReport(true);

        getStudentReportData(examId, studentId)
            .then(data => {
                setStudentReportData(data);
            })
            .catch(error => {
                setGlobalError(error.message || "Failed to fetch student report data");
            })
            .finally(() => setLoadingStudentReport(false));
    }, [examId, studentId, setGlobalError]);

    return { studentReportData, loadingStudentReport };
}
export default useFetchStudentReportData;