import { useState, useEffect } from "react";
import { getCourses } from "../service/teacherReportsService";

const useFetchCourses = (userId,setGlobalError) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) return;
        setLoading(true);

        getCourses(userId)
            .then(data => {
                setCourses(data);
            })
            .catch(error => {
                setGlobalError(error.message || "Failed to fetch courses");
            })
            .finally(() => setLoading(false));
    }, [userId]);
    return { courses, loading };
}
export default useFetchCourses;