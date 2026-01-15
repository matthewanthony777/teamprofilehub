import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateEducationDistribution } from '../../utils/analytics';
import { CHART_COLORS } from '../../constants';
import ChartExport from './ChartExport';

const EducationLevels = ({ employees, education }) => {
  const data = calculateEducationDistribution(employees, education);

  if (data.length === 0) {
    return (
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <h3 className="text-base font-semibold text-white mb-4">Education Distribution</h3>
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
          <p className="text-gray-400 font-medium">No education data yet</p>
          <p className="text-sm text-gray-500 mt-1">Add education entries to employee profiles to see distribution</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-gray-600 transition-all">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">Education Distribution</h3>
          <p className="text-sm text-gray-500">Education by category</p>
        </div>
        <ChartExport data={data} filename="education-distribution" headers={['category', 'count']} />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis dataKey="category" stroke="#2a2a2a" tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <YAxis stroke="#2a2a2a" tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              color: '#ffffff'
            }}
            labelStyle={{ color: '#9ca3af' }}
            formatter={(value) => [value, 'Count']}
          />
          <Bar dataKey="count" fill={CHART_COLORS.accent} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EducationLevels;
