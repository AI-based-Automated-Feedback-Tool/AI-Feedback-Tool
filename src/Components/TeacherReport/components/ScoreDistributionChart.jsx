import { CardBody } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import '../../../css/Reports/OverallReport/ScoreDistributionChart.css';
export default function ScoreDistributionChart({ scoreDistributionData }) {
  const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#e0d4ff', '#f3e8ff'];
  return (
    <div className="score-chart-container">
      <h3 className="chart-title">
        Score Distribution
      </h3>
      <p className="chart-subtitle">
        Number of students in each score range
      </p>

      <ResponsiveContainer width="100%" height={380}>
        <BarChart
          data={scoreDistributionData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6d28d9" />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="scoreRange"
            angle={-40}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 13, fill: '#64748b' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 13, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(139, 92, 246, 0.08)' }}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e0d4ff',
              borderRadius: '16px',
              padding: '12px 16px',
              boxShadow: '0 10px 30px rgba(139, 92, 246, 0.15)',
            }}
            labelStyle={{ color: '#5b21b6', fontWeight: 'bold' }}
          />
          <Bar
            dataKey="students"
            fill="url(#barGradient)"
            radius={[12, 12, 0, 0]}
            barSize={40}
          >
            {scoreDistributionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
