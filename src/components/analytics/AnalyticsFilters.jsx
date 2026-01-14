import { DEPARTMENTS } from '../../constants';

const AnalyticsFilters = ({ selectedDepartment, setSelectedDepartment }) => {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <label className="text-sm font-semibold text-gray-700">Filter by Department:</label>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="px-4 py-2 border-2 border-gray-200 rounded-xl bg-white transition-all duration-300 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 hover:border-gray-300 cursor-pointer"
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
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
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
