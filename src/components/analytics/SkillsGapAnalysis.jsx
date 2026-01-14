import { identifySkillsGaps } from '../../utils/analytics';
import ChartExport from './ChartExport';

const SkillsGapAnalysis = ({ employees, skills }) => {
  const gaps = identifySkillsGaps(employees, skills);

  const getSeverityBadge = (severity) => {
    const styles = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-amber-100 text-amber-800 border-amber-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[severity]}`}>
        {severity.toUpperCase()}
      </span>
    );
  };

  if (gaps.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
        <h3 className="text-xl font-semibold font-display mb-4">Skills Gap Analysis</h3>
        <div className="text-center py-8">
          <div className="inline-block p-3 bg-green-100 rounded-full mb-3">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium">No significant skills gaps identified!</p>
          <p className="text-sm text-gray-500 mt-1">Your team has good coverage across all skills</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold font-display">Skills Gap Analysis</h3>
          <p className="text-sm text-gray-500 mt-1">
            Skills requiring attention ({gaps.length} identified)
          </p>
        </div>
        <ChartExport
          data={gaps}
          filename="skills-gaps"
          headers={['skill', 'issue', 'severity', 'count', 'recommendation']}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left text-xs font-semibold text-gray-700 uppercase p-3 bg-gray-50">
                Skill
              </th>
              <th className="text-left text-xs font-semibold text-gray-700 uppercase p-3 bg-gray-50">
                Issue
              </th>
              <th className="text-center text-xs font-semibold text-gray-700 uppercase p-3 bg-gray-50">
                Severity
              </th>
              <th className="text-center text-xs font-semibold text-gray-700 uppercase p-3 bg-gray-50">
                Coverage
              </th>
              <th className="text-left text-xs font-semibold text-gray-700 uppercase p-3 bg-gray-50">
                Recommendation
              </th>
            </tr>
          </thead>
          <tbody>
            {gaps.map((gap, index) => (
              <tr
                key={`${gap.skill}-${index}`}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="p-3">
                  <span className="text-sm font-medium text-gray-900">{gap.skill}</span>
                </td>
                <td className="p-3">
                  <span className="text-sm text-gray-700">{gap.issue}</span>
                </td>
                <td className="p-3 text-center">{getSeverityBadge(gap.severity)}</td>
                <td className="p-3 text-center">
                  <span className="text-sm font-medium text-gray-900">
                    {gap.count} {gap.count === 1 ? 'person' : 'people'}
                  </span>
                </td>
                <td className="p-3">
                  <span className="text-sm text-gray-600">{gap.recommendation}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              <span className="font-semibold">{gaps.filter(g => g.severity === 'high').length}</span> High Priority
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              <span className="font-semibold">{gaps.filter(g => g.severity === 'medium').length}</span> Medium Priority
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              <span className="font-semibold">{gaps.filter(g => g.severity === 'low').length}</span> Low Priority
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsGapAnalysis;
