import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateSkillsDistribution } from '../../utils/analytics';
import { CHART_COLORS } from '../../constants';
import ChartExport from './ChartExport';

const SkillsDistribution = ({ employees, skills }) => {
  const data = calculateSkillsDistribution(employees, skills)
    .filter(item => item.count > 0)
    .slice(0, 20); // Limit to top 20 for readability

  if (data.length === 0) {
    return (
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <h3 className="text-base font-semibold text-white mb-4">Skills Distribution</h3>
        <p className="text-gray-500 text-center py-8">No skills data available</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-gray-600 transition-all">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">Skills Distribution</h3>
          <p className="text-sm text-gray-500">Top 20 skills by employee count</p>
        </div>
        <ChartExport
          data={data}
          filename="skills-distribution"
          headers={['skillName', 'category', 'count']}
        />
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis
            dataKey="skillName"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            stroke="#2a2a2a"
          />
          <YAxis stroke="#2a2a2a" tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              color: '#ffffff'
            }}
            labelStyle={{ color: '#9ca3af' }}
            formatter={(value, name) => [value, 'Employees']}
            labelFormatter={(label) => `Skill: ${label}`}
          />
          <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillsDistribution;
