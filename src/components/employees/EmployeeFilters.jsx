import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { DEPARTMENTS } from '../../constants';
import Button from '../common/Button';

const EmployeeFilters = () => {
  const { employees, skills, filters, setFilters } = useContext(AppContext);

  const roles = [...new Set(employees.map((e) => e.role))].sort();

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleSkillToggle = (skillId) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter((id) => id !== skillId)
        : [...prev.skills, skillId]
    }));
  };

  const clearFilters = () => {
    setFilters({ department: '', role: '', skills: [] });
  };

  const hasActiveFilters = filters.department || filters.role || filters.skills.length > 0;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} size="sm">
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Department Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Role Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Skills Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skills (select multiple)
          </label>
          <div className="border border-gray-300 rounded-md p-2 max-h-32 overflow-y-auto">
            {skills.slice(0, 10).map((skill) => (
              <label key={skill.id} className="flex items-center text-sm py-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.skills.includes(skill.id)}
                  onChange={() => handleSkillToggle(skill.id)}
                  className="mr-2"
                />
                {skill.name}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeFilters;
