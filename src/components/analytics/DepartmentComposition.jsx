import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateDepartmentStats } from '../../utils/analytics';
import { CHART_COLORS } from '../../constants';
import ChartExport from './ChartExport';

const DepartmentComposition = ({ employees }) => {
  const data = calculateDepartmentStats(employees);

  if (data.length === 0) {
    return (
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <h3 className="text-base font-semibold text-white mb-4">Department Composition</h3>
        <p className="text-gray-500 text-center py-8">No department data available</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-gray-600 transition-all">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">Department Composition</h3>
          <p className="text-sm text-gray-500">Employee count and skills per department</p>
        </div>
        <ChartExport
          data={data}
          filename="department-composition"
          headers={['department', 'employeeCount', 'totalSkills', 'avgSkills']}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {data.slice(0, 3).map((dept) => (
          <div
            key={dept.department}
            className="bg-dark-card border border-dark-border rounded-lg p-4"
          >
            <h4 className="text-sm font-medium text-gray-400">{dept.department}</h4>
            <div className="mt-2 flex items-end gap-4">
              <div>
                <p className="text-2xl font-bold text-white">{dept.employeeCount}</p>
                <p className="text-xs text-gray-500">Employees</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-accent-primary">{dept.avgSkills}</p>
                <p className="text-xs text-gray-500">Avg Skills</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis
            dataKey="department"
            angle={-45}
            textAnchor="end"
            height={80}
            stroke="#2a2a2a"
            tick={{ fontSize: 12, fill: '#9ca3af' }}
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
            formatter={(value, name) => {
              if (name === 'employeeCount') return [value, 'Employees'];
              if (name === 'avgSkills') return [value, 'Avg Skills'];
              return [value, name];
            }}
          />
          <Bar dataKey="employeeCount" fill={CHART_COLORS.info} radius={[8, 8, 0, 0]} name="Employees" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentComposition;
