import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import StatsCard from './StatsCard';
import Button from '../common/Button';
import MigrationPanel from '../MigrationPanel';
import { VIEWS } from '../../constants';

const Dashboard = () => {
  const { employees, skills, setCurrentView, handleExportCSV } = useContext(AppContext);

  const stats = {
    totalEmployees: employees.length,
    totalSkills: skills.length,
    departments: [...new Set(employees.map((e) => e.department))].length,
    avgSkillsPerEmployee:
      employees.length > 0
        ? (employees.reduce((sum, emp) => sum + (emp.skills || []).length, 0) / employees.length).toFixed(1)
        : 0
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-2">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back! Here's your employee overview.</p>
      </div>

      {/* Migration Panel - REMOVE AFTER SUCCESSFUL MIGRATION */}
      <MigrationPanel onMigrationComplete={() => window.location.reload()} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Total Skills"
          value={stats.totalSkills}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          }
        />
        <StatsCard
          title="Departments"
          value={stats.departments}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <StatsCard
          title="Avg Skills/Employee"
          value={stats.avgSkillsPerEmployee}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => setCurrentView(VIEWS.EMPLOYEES)}
            className="group bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-accent-primary transition-all text-left"
          >
            <div className="w-12 h-12 bg-dark-card border border-dark-border rounded-lg flex items-center justify-center mb-4 group-hover:border-accent-primary transition-all">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-accent-primary transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white mb-2 group-hover:text-accent-primary transition-all">View All Employees</h3>
            <p className="text-sm text-gray-500 mb-4">Browse and manage employee records</p>
            <div className="flex items-center text-sm text-gray-500 group-hover:text-accent-primary transition-all">
              <span>Go to employees</span>
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => setCurrentView(VIEWS.SKILLS)}
            className="group bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-accent-primary transition-all text-left"
          >
            <div className="w-12 h-12 bg-dark-card border border-dark-border rounded-lg flex items-center justify-center mb-4 group-hover:border-accent-primary transition-all">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-accent-primary transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white mb-2 group-hover:text-accent-primary transition-all">Manage Skills</h3>
            <p className="text-sm text-gray-500 mb-4">Add or edit skills catalog</p>
            <div className="flex items-center text-sm text-gray-500 group-hover:text-accent-primary transition-all">
              <span>Manage catalog</span>
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => setCurrentView(VIEWS.EMPLOYEE_FORM)}
            className="group bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-accent-primary transition-all text-left"
          >
            <div className="w-12 h-12 bg-dark-card border border-dark-border rounded-lg flex items-center justify-center mb-4 group-hover:border-accent-primary transition-all">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-accent-primary transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white mb-2 group-hover:text-accent-primary transition-all">Add New Employee</h3>
            <p className="text-sm text-gray-500 mb-4">Create a new employee record</p>
            <div className="flex items-center text-sm text-gray-500 group-hover:text-accent-primary transition-all">
              <span>Add employee</span>
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
