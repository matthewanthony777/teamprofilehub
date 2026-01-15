import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getTopSkills } from '../../utils/analytics';
import { CHART_COLORS } from '../../constants';
import ChartExport from './ChartExport';

const TopSkills = ({ employees, skills }) => {
  const data = getTopSkills(employees, skills, 10);

  if (data.length === 0) {
    return (
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <h3 className="text-base font-semibold text-white mb-4">Top 10 Skills</h3>
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <p className="text-gray-400 font-medium">No skills data yet</p>
          <p className="text-sm text-gray-500 mt-1">Add skills to employee profiles to see top skills</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-gray-600 transition-all">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">Top 10 Skills</h3>
          <p className="text-sm text-gray-500">Most common skills across the team</p>
        </div>
        <ChartExport
          data={data}
          filename="top-skills"
          headers={['skillName', 'category', 'count']}
        />
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis type="number" stroke="#2a2a2a" tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <YAxis
            type="category"
            dataKey="skillName"
            stroke="#2a2a2a"
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            width={90}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              color: '#ffffff'
            }}
            labelStyle={{ color: '#9ca3af' }}
            formatter={(value) => [value, 'Employees']}
          />
          <Bar dataKey="count" fill={CHART_COLORS.secondary} radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopSkills;
