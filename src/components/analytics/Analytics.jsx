import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { PROFICIENCY_LEVELS } from '../../constants';
import {
  calculateSkillsDistribution,
  calculateProficiencyDistribution,
  calculateEducationDistribution,
  calculateDepartmentStats,
  getTopSkills,
  identifySkillsGaps,
  filterEmployeesByDepartment
} from '../../utils/analytics';
import { exportAnalyticsToCSV } from '../../utils/analyticsExport';
import PageLayout from '../PageLayout';
import AnalyticsFilters from './AnalyticsFilters';
import SkillsDistribution from './SkillsDistribution';
import ProficiencyBreakdown from './ProficiencyBreakdown';
import TopSkills from './TopSkills';
import EducationLevels from './EducationLevels';
import DepartmentComposition from './DepartmentComposition';
import SkillsMatrix from './SkillsMatrix';
import SkillsGapAnalysis from './SkillsGapAnalysis';
import Button from '../common/Button';

const Analytics = () => {
  const { employees, skills, education } = useContext(AppContext);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  // DIAGNOSTIC LOGGING - Track data received by Analytics
  console.log('=== ANALYTICS COMPONENT RENDER ===');
  console.log('Employees received:', employees);
  console.log('Employees count:', Array.isArray(employees) ? employees.length : 'NOT AN ARRAY');
  console.log('Skills received:', skills);
  console.log('Skills count:', Array.isArray(skills) ? skills.length : 'NOT AN ARRAY');
  console.log('Education received:', education);
  console.log('Education count:', Array.isArray(education) ? education.length : 'NOT AN ARRAY');

  const filteredEmployees = filterEmployeesByDepartment(employees, selectedDepartment);
  console.log('Filtered employees count:', Array.isArray(filteredEmployees) ? filteredEmployees.length : 'NOT AN ARRAY');

  // Show empty state if no employees
  if (!employees || employees.length === 0) {
    return (
      <PageLayout
        title="Analytics Dashboard"
        description="Visual insights into skills, education, and team composition"
      >
        <div className="bg-dark-surface border border-dark-border rounded-xl p-12 text-center">
          <div className="text-gray-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Data Available</h3>
          <p className="text-gray-500">Add employees to see analytics and insights.</p>
        </div>
      </PageLayout>
    );
  }

  const handleExportAnalytics = () => {
    const analyticsData = {
      skillsDistribution: calculateSkillsDistribution(filteredEmployees, skills),
      proficiencyDistribution: calculateProficiencyDistribution(filteredEmployees, PROFICIENCY_LEVELS),
      educationDistribution: calculateEducationDistribution(filteredEmployees, education),
      departmentStats: calculateDepartmentStats(employees),
      skillsGaps: identifySkillsGaps(employees, skills)
    };

    exportAnalyticsToCSV(analyticsData, 'sqc-analytics');
  };

  return (
    <PageLayout
      title="Analytics Dashboard"
      description={`Visual insights into skills, education, and team composition${selectedDepartment ? ` • ${selectedDepartment} Department` : ''}`}
      actions={
        <Button variant="secondary" onClick={handleExportAnalytics}>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export Analytics
          </span>
        </Button>
      }
    >
      {/* Filters */}
      <AnalyticsFilters
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillsDistribution employees={filteredEmployees} skills={skills} />
        <ProficiencyBreakdown employees={filteredEmployees} />
        <TopSkills employees={filteredEmployees} skills={skills} />
        <EducationLevels employees={filteredEmployees} education={education} />
      </div>

      {/* Full-width components */}
      <SkillsMatrix
        employees={filteredEmployees}
        skills={skills}
        selectedDepartment={selectedDepartment}
      />
      <DepartmentComposition employees={employees} />
      <SkillsGapAnalysis employees={employees} skills={skills} />
    </PageLayout>
  );
};

export default Analytics;
