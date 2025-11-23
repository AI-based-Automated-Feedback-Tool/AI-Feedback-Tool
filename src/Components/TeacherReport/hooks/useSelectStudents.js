import { useState } from "react";
import useFetchStudents from "./useFetchStudents";
import { useEffect } from "react";

const useSelectStudents = (selectedCourse, setError, examSubmissions) => {
    const { students, loading } = useFetchStudents(selectedCourse, setError);
    const [studentList, setStudentList] = useState({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        setProcessing(true);
        if (!examSubmissions || examSubmissions.length === 0) {
            const list = students.map(student => ({
                user_id: student.user_id,
                name: student.name,
                status: "Not Submitted",
                total_score: null,
                time_taken: null,
                focus_loss_count: null,
            }));
            setStudentList(list);
            return;
        }

        const list = students.map(student => {
            const submission = examSubmissions.find(sub => sub.student_id == student.user_id);

            return {
                user_id: student.user_id,
                name: student.name,
                status: submission ? "Submitted" : "Not Submitted",
                total_score: submission?.total_score ?? null,
                time_taken: submission?.time_taken ?? null,
                focus_loss_count: submission?.focus_loss_count ?? null,
            };
        });
        console.log("Compiled student list:", list);
        setStudentList(list);
        setProcessing(false);

    }, [students, examSubmissions]);

    return { studentList, processing };
};

export default useSelectStudents;