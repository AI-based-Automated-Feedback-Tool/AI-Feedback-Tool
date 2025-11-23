import { CardBody, Table } from 'react-bootstrap';

export default function ExamReportTable({studentList}) {
    return (
        <CardBody>
            <h5 className="mb-4">📊 Student Submission Status</h5>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Status</th>
                        <th>Total Score</th>
                        <th>Time Taken (mins)</th>
                        <th>Focus Loss Count</th>
                    </tr>
                </thead>
                <tbody>
                    {studentList.map((student) => (
                        <tr key={student.user_id}>
                            <td>{student.name}</td>
                            <td>{student.status}</td>
                            <td>{student.total_score !== null ? student.total_score : 'N/A'}</td>
                            <td>{student.time_taken !== null ? student.time_taken : 'N/A'}</td>
                            <td>{student.focus_loss_count !== null ? student.focus_loss_count : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </CardBody> 
  )
}
