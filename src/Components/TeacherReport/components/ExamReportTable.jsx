import { CardBody, Table } from 'react-bootstrap';
import '../../../css/Reports/OverallReport/ExamReportTable.css';

export default function ExamReportTable({studentList}) {
    return (
        <div className="report-table-card">
            <div className="table-header">
                <h3 className="table-title">Student Submission Status</h3>
                <span className="student-count">{studentList.length} students</span>
            </div>
            <div className="table-wrapper">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Student Name</th>
                            <th>Status</th>
                            <th>Total Score</th>
                            <th>Time Taken (mins)</th>
                            <th>Focus Loss Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentList.map((student, index) => (
                            <tr key={student.user_id} className="table-row">
                                <td>{index + 1}</td>  
                                <td className="student-cell">
                                    <div className="student-info">
                                        <span className="student-name">{student.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <span
                                        className={`status-badge ${
                                        student.status === 'Completed'
                                            ? 'completed'
                                            : 'not-started'
                                        }`}
                                    >
                                        {student.status || 'Not Started'}
                                    </span>
                                </td>
                                <td className="score-cell">
                                    {student.total_score !== null ? (
                                        <strong className="score-value">{student.total_score}</strong>
                                    ) : (
                                        <span className="na">—</span>
                                    )}
                                </td>
                                <td className="time-cell">
                                    {student.time_taken !== null ? (
                                        <span>{student.time_taken} min</span>
                                    ) : (
                                        <span className="na">—</span>
                                    )}
                                </td>
                                <td className="focus-cell">
                                    {student.focus_loss_count !== null ? (
                                        <span className={student.focus_loss_count > 5 ? 'high-focus-loss' : ''}>
                                        {student.focus_loss_count}
                                        </span>
                                    ) : (
                                        <span className="na">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> 
        </div>
    )
}
