import { useState, useEffect } from "react";
import { getStudentReportData } from "../service/teacherReportsService";

const useFetchStudentReportData = (examId, studentId, examType, setGlobalError) => {
    const [studentReportData, setStudentReportData] = useState(null);
    const [loadingStudentReport, setLoadingStudentReport] = useState(false);

    useEffect(() => {
        if (!examId || !studentId || !examType) return;
        setLoadingStudentReport(true);

        getStudentReportData(examId, studentId, examType)
            .then(data => {
                setStudentReportData(data);
            })
            .catch(error => {
                setGlobalError(error.message || "Failed to fetch student report data");
            })
            .finally(() => setLoadingStudentReport(false));
    }, [examId, studentId, examType, setGlobalError]);

    return { studentReportData, loadingStudentReport };
}
export default useFetchStudentReportData;