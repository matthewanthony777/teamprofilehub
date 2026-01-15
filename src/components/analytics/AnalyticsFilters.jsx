import { DEPARTMENTS } from '../../constants';

const AnalyticsFilters = ({ selectedDepartment, setSelectedDepartment }) => {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <label className="text-sm font-medium text-gray-400">Filter by Department:</label>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="px-4 py-2.5 border border-dark-border rounded-lg bg-dark-card text-white transition-all focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 hover:border-gray-600 cursor-pointer"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {selectedDepartment && (
          <button
            onClick={() => setSelectedDepartment('')}
            className="text-sm text-accent-primary hover:text-accent-hover font-medium flex items-center gap-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Filter
          </button>
        )}
      </div>
    </div>
  );
};

export default AnalyticsFilters;
