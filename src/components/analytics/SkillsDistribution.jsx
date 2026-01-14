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
      <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
        <h3 className="text-xl font-semibold font-display mb-4">Skills Distribution</h3>
        <p className="text-gray-500 text-center py-8">No skills data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold font-display">Skills Distribution</h3>
          <p className="text-sm text-gray-500 mt-1">Top 20 skills by employee count</p>
        </div>
        <ChartExport
          data={data}
          filename="skills-distribution"
          headers={['skillName', 'category', 'count']}
        />
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="skillName"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
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
