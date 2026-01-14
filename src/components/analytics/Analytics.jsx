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

  const filteredEmployees = filterEmployeesByDepartment(employees, selectedDepartment);

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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 font-display">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Visual insights into skills, education, and team composition
            {selectedDepartment && ` • ${selectedDepartment} Department`}
          </p>
        </div>
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
      </div>

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
    </div>
  );
};

export default Analytics;
