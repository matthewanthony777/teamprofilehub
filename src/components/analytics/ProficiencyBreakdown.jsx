import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateProficiencyDistribution } from '../../utils/analytics';
import { PROFICIENCY_LEVELS } from '../../constants';
import ChartExport from './ChartExport';

const PROFICIENCY_CHART_COLORS = {
  Beginner: '#9ca3af',
  Intermediate: '#3b82f6',
  Advanced: '#10b981',
  Expert: '#8b5cf6'
};

const ProficiencyBreakdown = ({ employees }) => {
  const data = calculateProficiencyDistribution(employees, PROFICIENCY_LEVELS);
  const totalSkills = data.reduce((sum, item) => sum + item.count, 0);

  if (totalSkills === 0) {
    return (
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <h3 className="text-base font-semibold text-white mb-4">Proficiency Breakdown</h3>
        <p className="text-gray-500 text-center py-8">No proficiency data available</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-gray-600 transition-all">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">Proficiency Breakdown</h3>
          <p className="text-sm text-gray-500">Distribution across all skills</p>
        </div>
        <ChartExport
          data={data}
          filename="proficiency-breakdown"
          headers={['level', 'count', 'percentage']}
        />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ level, percentage }) => (percentage > 0 ? `${level}: ${percentage}%` : '')}
            outerRadius={100}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PROFICIENCY_CHART_COLORS[entry.level]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              color: '#ffffff'
            }}
            labelStyle={{ color: '#9ca3af' }}
            formatter={(value, name, props) => [
              `${value} (${props.payload.percentage}%)`,
              props.payload.level
            ]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => `${entry.payload.level} (${entry.payload.count})`}
            wrapperStyle={{ color: '#9ca3af' }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Stats summary */}
      <div className="mt-4 pt-4 border-t border-dark-border">
        <div className="grid grid-cols-2 gap-4">
          {data.map((item) => (
            <div key={item.level} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: PROFICIENCY_CHART_COLORS[item.level] }}
              ></div>
              <span className="text-sm text-gray-400">
                {item.level}: <span className="font-semibold text-white">{item.count}</span> ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProficiencyBreakdown;
