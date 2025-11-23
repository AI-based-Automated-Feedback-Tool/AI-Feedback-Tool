import { useState, useEffect } from "react";
import { getStudents } from "../service/teacherReportsService";

const useFetchStudents = (selectedCourse, setGlobalError) => {
    const [students, setStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    useEffect(() => {
        if (!selectedCourse) return;
        setLoadingStudents(true);

        getStudents(selectedCourse)
            .then(data => {
                setStudents(data);
            })
            .catch(error => {
                setGlobalError(error.message || "Failed to fetch students");
            })
            .finally(() => setLoadingStudents(false));
    }, [selectedCourse]);
    return { students, loadingStudents };
}
export default useFetchStudents;