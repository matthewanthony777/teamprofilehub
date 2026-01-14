import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import SearchBar from '../common/SearchBar';
import EmployeeFilters from './EmployeeFilters';
import EmployeeCard from './EmployeeCard';
import Button from '../common/Button';
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Employees</h2>
        <Button onClick={() => setCurrentView(VIEWS.EMPLOYEE_FORM)}>Add Employee</Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search employees by name, role, or email..."
        />
      </div>

      <EmployeeFilters />

      <div className="text-sm text-gray-600">
        Showing {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No employees found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
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
    </div>
  );
};

export default EmployeeList;
