import { BarChart,Bar,XAxis,YAxis,Tooltip,Legend,ResponsiveContainer,CartesianGrid } from 'recharts';
import { Row, Col, CardHeader, CardBody, Card, Button, Alert } from 'react-bootstrap';

export default function QuestionAccuracyChart() {
    const questionStats = [
        { id: 'Question 1', full: 'Solve 5*5', correct: 75, incorrect: 25 },
        { id: 'Question 2', full: 'Solve 2*4*7', correct: 50, incorrect: 50 },
        { id: 'Question 3', full: 'Solve given equations', correct: 90, incorrect: 10 },
        { id: 'Question 4', full: 'Solve 7*6', correct: 30, incorrect: 70 },
    ];

    return (
        <CardBody>
            <h5 className="mb-4">📊 Question Accuracy Breakdown</h5>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    layout="vertical"
                    data={questionStats}
                    margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                >
                <CartesianGrid strokeDasharray="3 3" />  
  
                <YAxis type="category" dataKey="id" />

                <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />

                {/* Show full question on hover */}
                <Tooltip
                    formatter={(value) => `${value}%`}
                    labelFormatter={(label, payload) => {
                        const fullQuestion = questionStats.find(q => q.id === label)?.full;
                        return fullQuestion || label;
                    }}
                />

                <Legend />
                <Bar dataKey="correct" fill="#28a745" name="Correct %" />
                <Bar dataKey="incorrect" fill="#dc3545" name="Incorrect %" />
                </BarChart>
            </ResponsiveContainer>
        </CardBody> 
  )
}
