import { CardBody } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ScoreDistributionChart({ scoreDistributionData }) {
  return (
    <CardBody>
        <h5 className="mb-4">📈 Score Distribution</h5>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="scoreRange" label={{ value: 'Score Range', position: 'insideBottom', offset: -5 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="#0d6efd" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </CardBody>
  )
}
