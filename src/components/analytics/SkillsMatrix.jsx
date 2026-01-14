import { calculateSkillsMatrix, getTopSkills } from '../../utils/analytics';
import { DEPARTMENTS } from '../../constants';
import ChartExport from './ChartExport';

const SkillsMatrix = ({ employees, skills, selectedDepartment }) => {
  // Use only top 10 skills to keep the matrix readable
  const topSkills = getTopSkills(employees, skills, 10);
  const skillNames = topSkills.map(s => s.skillName);

  // Get departments to show
  const departmentsToShow = selectedDepartment
    ? [selectedDepartment]
    : DEPARTMENTS.filter(dept => employees.some(emp => emp.department === dept));

  const matrixData = calculateSkillsMatrix(employees, skills, departmentsToShow);

  // Function to get color intensity based on percentage
  const getColorIntensity = (percentage) => {
    if (percentage === 0) return 'bg-gray-50';
    if (percentage < 25) return 'bg-blue-100';
    if (percentage < 50) return 'bg-blue-200';
    if (percentage < 75) return 'bg-blue-300';
    return 'bg-blue-400';
  };

  // Prepare export data
  const exportData = matrixData.map(row => {
    const rowData = { department: row.department };
    skillNames.forEach(skillName => {
      rowData[skillName] = row.skills[skillName] || 0;
    });
    return rowData;
  });

  if (matrixData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
        <h3 className="text-xl font-semibold font-display mb-4">Skills Coverage Matrix</h3>
        <p className="text-gray-500 text-center py-8">No matrix data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold font-display">Skills Coverage Matrix</h3>
          <p className="text-sm text-gray-500 mt-1">
            Percentage of employees in each department with each skill (Top 10 skills)
          </p>
        </div>
        <ChartExport
          data={exportData}
          filename="skills-matrix"
          headers={['department', ...skillNames]}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left text-xs font-semibold text-gray-700 uppercase p-3 border-b-2 border-gray-200 bg-gray-50 sticky left-0 z-10">
                Department
              </th>
              {skillNames.map((skillName) => (
                <th
                  key={skillName}
                  className="text-center text-xs font-semibold text-gray-700 uppercase p-3 border-b-2 border-gray-200 bg-gray-50 whitespace-nowrap"
                >
                  {skillName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrixData.map((row) => (
              <tr key={row.department} className="hover:bg-gray-50 transition-colors">
                <td className="text-sm font-medium text-gray-900 p-3 border-b border-gray-200 whitespace-nowrap sticky left-0 bg-white z-10">
                  {row.department}
                  <span className="text-xs text-gray-500 ml-2">({row.employeeCount})</span>
                </td>
                {skillNames.map((skillName) => {
                  const percentage = row.skills[skillName] || 0;
                  return (
                    <td
                      key={`${row.department}-${skillName}`}
                      className={`text-center text-sm p-3 border-b border-gray-200 ${getColorIntensity(percentage)}`}
                    >
                      {percentage > 0 ? `${percentage}%` : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
        <span className="font-medium">Coverage:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
          <span>0%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 rounded"></div>
          <span>&lt;25%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-200 rounded"></div>
          <span>25-50%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-300 rounded"></div>
          <span>50-75%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-400 rounded"></div>
          <span>&gt;75%</span>
        </div>
      </div>
    </div>
  );
};

export default SkillsMatrix;
