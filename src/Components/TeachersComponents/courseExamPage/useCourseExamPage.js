import { useState, useEffect } from "react";
import { deleteExam } from "./courseExamPageService";

const useDeleteExam = (setExams) => {
    const [deletingId, setDeletingId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    const handleDeleteClick = (examId, examTitle) => {
        // ask for confirmation
        const confirm1 = window.confirm(
            `⚠️ DELETE EXAM?\n\n"${examTitle}"\n\nThis action cannot be undone.`
        );
        if (!confirm1) return;

        const confirm2 = window.prompt(
            `To permanently delete "${examTitle}", type: DELETE`
        );
        if (confirm2 !== "DELETE") {
            alert("Deletion cancelled");
            return;
        }
        performDelete(examId);
    };

    const performDelete = async (examId) => {
        setDeletingId(examId);
        setDeleting(true);
        try {
            const examData = { exam_id: examId };
            const response = await deleteExam(examData);

            if (response.success) {
                // Remove deleted exam from state
                setExams((prevExams) => prevExams.filter((exam) => exam.exam_id !== examId));
            }
        } catch (err) {
            console.error('Error deleting exam:', err);
            setDeleteError('Failed to delete exam');
        }
        setDeleting(false);
        setDeletingId(null);
    }
    return { deletingId, deleting, deleteError, handleDeleteClick};
}
export default useDeleteExam;