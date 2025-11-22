import { useState, useEffect } from "react";
import { getCourses } from "../service/teacherReportsService";

const useFetchCourses = (userId,setGlobalError) => {
    const [courses, setCourses] = useState([]);
    const [courseLoading, setCourseLoading] = useState(false);

    useEffect(() => {
        if (!userId) return;
        setCourseLoading(true);

        getCourses(userId)
            .then(data => {
                setCourses(data);
            })
            .catch(error => {
                setGlobalError(error.message || "Failed to fetch courses");
            })
            .finally(() => setCourseLoading(false));
    }, [userId]);
    return { courses, courseLoading };
}
export default useFetchCourses;