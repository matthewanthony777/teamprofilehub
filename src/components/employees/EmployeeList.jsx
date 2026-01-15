import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import PageLayout from '../PageLayout';
import SearchBar from '../common/SearchBar';
import EmployeeFilters from './EmployeeFilters';
import EmployeeCard from './EmployeeCard';
import { VIEWS } from '../../constants';

const EmployeeList = () => {
  const {
    getFilteredEmployees,
    setCurrentView,
    setSelectedEmployee,
    searchQuery,
    setSearchQuery
  } = useContext(AppContext);

  const filteredEmployees = getFilteredEmployees();

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setCurrentView(VIEWS.EMPLOYEE_DETAIL);
  };

  return (
    <PageLayout
      title="Employees"
      description={`Showing ${filteredEmployees.length} employee${filteredEmployees.length !== 1 ? 's' : ''}`}
    >
      {/* Search and Filters */}
      <div className="space-y-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search employees by name, role, or email..."
        />

        <EmployeeFilters />
      </div>

      {/* Employee Grid */}
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-12 bg-dark-surface border border-dark-border rounded-xl">
          <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-white text-lg font-semibold mb-2">No employees found</p>
          <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => {
            if (!employee || !employee.id) return null;
            return (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onClick={() => handleEmployeeClick(employee)}
              />
            );
          })}
        </div>
      )}
    </PageLayout>
  );
};

export default EmployeeList;
