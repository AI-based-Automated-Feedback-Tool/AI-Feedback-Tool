import { BarChart,Bar,XAxis,YAxis,Tooltip,Legend,ResponsiveContainer,CartesianGrid } from 'recharts';
import { Row, Col, CardHeader, CardBody, Card, Button, Alert } from 'react-bootstrap';

export default function QuestionAccuracyChart({questionStats}) {

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
