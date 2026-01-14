import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateDepartmentStats } from '../../utils/analytics';
import { CHART_COLORS } from '../../constants';
import ChartExport from './ChartExport';

const DepartmentComposition = ({ employees }) => {
  const data = calculateDepartmentStats(employees);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
        <h3 className="text-xl font-semibold font-display mb-4">Department Composition</h3>
        <p className="text-gray-500 text-center py-8">No department data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold font-display">Department Composition</h3>
          <p className="text-sm text-gray-500 mt-1">Employee count and skills per department</p>
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
            className="bg-gradient-to-br from-primary-50/50 to-purple-50/50 border border-primary-200 rounded-xl p-4"
          >
            <h4 className="text-sm font-medium text-gray-600">{dept.department}</h4>
            <div className="mt-2 flex items-end gap-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">{dept.employeeCount}</p>
                <p className="text-xs text-gray-500">Employees</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-primary-600">{dept.avgSkills}</p>
                <p className="text-xs text-gray-500">Avg Skills</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="department"
            angle={-45}
            textAnchor="end"
            height={80}
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
          />
          <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
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
