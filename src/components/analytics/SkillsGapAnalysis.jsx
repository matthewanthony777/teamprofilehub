import { identifySkillsGaps } from '../../utils/analytics';
import ChartExport from './ChartExport';

const SkillsGapAnalysis = ({ employees, skills }) => {
  const gaps = identifySkillsGaps(employees, skills);

  const getSeverityBadge = (severity) => {
    const styles = {
      high: 'bg-red-900/30 text-red-400 border-red-800',
      medium: 'bg-amber-900/30 text-amber-400 border-amber-800',
      low: 'bg-blue-900/30 text-blue-400 border-blue-800'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[severity]}`}>
        {severity.toUpperCase()}
      </span>
    );
  };

  if (gaps.length === 0) {
    return (
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <h3 className="text-base font-semibold text-white mb-4">Skills Gap Analysis</h3>
        <div className="text-center py-8">
          <div className="inline-block p-3 bg-green-900/30 border border-green-800 rounded-full mb-3">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-white font-medium">No significant skills gaps identified!</p>
          <p className="text-sm text-gray-500 mt-1">Your team has good coverage across all skills</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-gray-600 transition-all">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">Skills Gap Analysis</h3>
          <p className="text-sm text-gray-500">
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
            <tr className="border-b-2 border-dark-border">
              <th className="text-left text-xs font-semibold text-gray-400 uppercase p-3 bg-dark-card">
                Skill
              </th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase p-3 bg-dark-card">
                Issue
              </th>
              <th className="text-center text-xs font-semibold text-gray-400 uppercase p-3 bg-dark-card">
                Severity
              </th>
              <th className="text-center text-xs font-semibold text-gray-400 uppercase p-3 bg-dark-card">
                Coverage
              </th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase p-3 bg-dark-card">
                Recommendation
              </th>
            </tr>
          </thead>
          <tbody>
            {gaps.map((gap, index) => (
              <tr
                key={`${gap.skill}-${index}`}
                className="border-b border-dark-border hover:bg-dark-card/50 transition-colors"
              >
                <td className="p-3">
                  <span className="text-sm font-medium text-white">{gap.skill}</span>
                </td>
                <td className="p-3">
                  <span className="text-sm text-gray-400">{gap.issue}</span>
                </td>
                <td className="p-3 text-center">{getSeverityBadge(gap.severity)}</td>
                <td className="p-3 text-center">
                  <span className="text-sm font-medium text-white">
                    {gap.count} {gap.count === 1 ? 'person' : 'people'}
                  </span>
                </td>
                <td className="p-3">
                  <span className="text-sm text-gray-400">{gap.recommendation}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-dark-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-400">
              <span className="font-semibold text-white">{gaps.filter(g => g.severity === 'high').length}</span> High Priority
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-sm text-gray-400">
              <span className="font-semibold text-white">{gaps.filter(g => g.severity === 'medium').length}</span> Medium Priority
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-400">
              <span className="font-semibold text-white">{gaps.filter(g => g.severity === 'low').length}</span> Low Priority
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsGapAnalysis;
