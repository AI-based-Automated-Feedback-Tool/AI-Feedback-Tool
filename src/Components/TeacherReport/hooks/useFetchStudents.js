import { useState, useEffect } from "react";
import { getStudents } from "../service/teacherReportsService";

const useFetchStudents = (selectedCourse, setGlobalError) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedCourse) return;
        setLoading(true);

        getStudents(selectedCourse)
            .then(data => {
                setStudents(data);
            })
            .catch(error => {
                setGlobalError(error.message || "Failed to fetch students");
            })
            .finally(() => setLoading(false));
    }, [selectedCourse]);
    return { students, loading };
}
export default useFetchStudents;