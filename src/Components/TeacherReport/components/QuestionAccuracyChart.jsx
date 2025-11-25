import { BarChart,Bar,XAxis,YAxis,Tooltip,Legend,ResponsiveContainer,Cell, CartesianGrid } from 'recharts';
import { Row, Col, CardHeader, CardBody, Card, Button, Alert } from 'react-bootstrap';
import '../../../css/Reports/OverallReport/QuestionAcuracyChart.css';
export default function QuestionAccuracyChart({questionStats}) {

    return (
        <div className="question-accuracy-card">
            <div className="chart-header">
                <h3 className="chart-title">
                    Question Accuracy Breakdown
                </h3>
                <p className="chart-subtitle">
                    How students performed on each question (% correct)
                </p>
            </div>

            <div style={{ width: '100%', height: Math.max(300, questionStats.length * 70) }}>
            <ResponsiveContainer
                width="100%"
                height={Math.max(320, questionStats.length * 75)}
            >
                <BarChart
                    layout="vertical"
                    data={questionStats}
                    margin={{ top: 20, right: 50, left: 20, bottom: 20 }}
                >  
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" />
                
                <YAxis 
                    type="category" 
                    dataKey="id" 
                    width={120}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 14, fontWeight: 600, fill: '#1e293b'}}
                />
                <XAxis 
                    type="number" 
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]} 
                    tickFormatter={(v) => `${v}%`} 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 13, fill: '#64748b' }}
                />

                <Tooltip
                    cursor={{ fill: 'rgba(139, 92, 246, 0.08)' }}
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e0d4ff',
                        borderRadius: '16px',
                        padding: '12px 16px',
                        boxShadow: '0 10px 30px rgba(139, 92, 246, 0.18)',
                    }}
                    labelStyle={{ color: '#5b21b6', fontWeight: 'bold', marginBottom: '8px' }}
                    formatter={(value) => <strong>{value}%</strong>}
                    labelFormatter={(label) => {
                        const fullQuestion = questionStats.find(q => q.id === label);
                        return fullQuestion?.full || label;
                    }}
                />

                <Bar dataKey="correct" barSize={32} radius={[0, 8, 8, 0]} stackId="a" minPointSize={8}>
                    {questionStats.map((entry, index) => (
                        <Cell 
                            key={entry.id} 
                            fill={
                                entry.correct >= 80
                                    ? '#22c55e'     // green
                                    : entry.correct >= 50
                                    ? '#f59e0b'     // yellow
                                    : '#ef4444'     // red} 
                            }
                        />
                    ))}
                </Bar>

                </BarChart>
            </ResponsiveContainer>
        </div>

        <div className="accuracy-legend">
            <div className="legend-item">
                <span className="legend-dot good"></span>
                <span className="legend-text">80–100% — <strong>Excellent</strong></span>
            </div>
            <div className="legend-item">
                <span className="legend-dot medium"></span>
                <span className="legend-text">50–79% — <strong>Good</strong></span>
            </div>
            <div className="legend-item">
                <span className="legend-dot poor"></span>
                <span className="legend-text">0–49% — <strong>Needs Attention</strong></span>
            </div>
        </div>
    </div> 
  )
}
