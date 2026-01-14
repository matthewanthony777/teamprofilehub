// Analytics calculation functions for the SQC Employee Hub

/**
 * Calculate the distribution of skills across all employees
 * @param {Array} employees - Array of employee objects
 * @param {Array} skills - Array of skill objects
 * @returns {Array} - Array of { skillId, skillName, category, count } sorted by count (desc)
 */
export const calculateSkillsDistribution = (employees, skills) => {
  const skillCounts = {};

  employees.forEach(emp => {
    (emp.skills || []).forEach(({ skillId }) => {
      skillCounts[skillId] = (skillCounts[skillId] || 0) + 1;
    });
  });

  return skills.map(skill => ({
    skillId: skill.id,
    skillName: skill.name,
    category: skill.category,
    count: skillCounts[skill.id] || 0
  })).sort((a, b) => b.count - a.count);
};

/**
 * Calculate proficiency level distribution across all employee skills
 * @param {Array} employees - Array of employee objects
 * @param {Array} proficiencyLevels - Array of proficiency level strings
 * @returns {Array} - Array of { level, count, percentage }
 */
export const calculateProficiencyDistribution = (employees, proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']) => {
  const counts = {};
  proficiencyLevels.forEach(level => counts[level] = 0);

  employees.forEach(emp => {
    (emp.skills || []).forEach(({ proficiencyLevel }) => {
      if (counts.hasOwnProperty(proficiencyLevel)) {
        counts[proficiencyLevel]++;
      }
    });
  });

  const total = Object.values(counts).reduce((sum, c) => sum + c, 0);

  return Object.entries(counts).map(([level, count]) => ({
    level,
    count,
    percentage: total > 0 ? parseFloat(((count / total) * 100).toFixed(1)) : 0
  }));
};

/**
 * Calculate education distribution by level
 * @param {Array} employees - Array of employee objects
 * @param {Array} education - Array of education objects (legacy, kept for backward compatibility)
 * @returns {Array} - Array of { category, count }
 */
export const calculateEducationDistribution = (employees, education) => {
  const levelCounts = {};

  employees.forEach(emp => {
    (emp.education || []).forEach((edu) => {
      // Support both new structure (inline with level field) and old structure (educationId reference)
      let level = null;

      if (edu.level) {
        // New structure - inline education data
        level = edu.level;
      } else if (edu.educationId) {
        // Old structure - reference to global education catalog
        const eduDetails = education.find(e => e.id === edu.educationId);
        if (eduDetails && eduDetails.category) {
          level = eduDetails.category;
        }
      }

      if (level) {
        levelCounts[level] = (levelCounts[level] || 0) + 1;
      }
    });
  });

  return Object.entries(levelCounts).map(([category, count]) => ({
    category,
    count
  })).sort((a, b) => b.count - a.count);
};

/**
 * Calculate department statistics
 * @param {Array} employees - Array of employee objects
 * @returns {Array} - Array of { department, employeeCount, avgSkills, totalSkills }
 */
export const calculateDepartmentStats = (employees) => {
  const departmentData = {};

  employees.forEach(emp => {
    const dept = emp.department;
    if (!departmentData[dept]) {
      departmentData[dept] = {
        department: dept,
        employeeCount: 0,
        totalSkills: 0
      };
    }

    departmentData[dept].employeeCount++;
    departmentData[dept].totalSkills += (emp.skills || []).length;
  });

  return Object.values(departmentData).map(dept => ({
    ...dept,
    avgSkills: dept.employeeCount > 0
      ? parseFloat((dept.totalSkills / dept.employeeCount).toFixed(1))
      : 0
  })).sort((a, b) => b.employeeCount - a.employeeCount);
};

/**
 * Get top N skills by employee count
 * @param {Array} employees - Array of employee objects
 * @param {Array} skills - Array of skill objects
 * @param {number} limit - Number of top skills to return
 * @returns {Array} - Top N skills
 */
export const getTopSkills = (employees, skills, limit = 10) => {
  const distribution = calculateSkillsDistribution(employees, skills);
  return distribution.filter(s => s.count > 0).slice(0, limit);
};

/**
 * Identify skills gaps (skills with low coverage or no experts)
 * @param {Array} employees - Array of employee objects
 * @param {Array} skills - Array of skill objects
 * @returns {Array} - Array of { skill, issue, severity, recommendation }
 */
export const identifySkillsGaps = (employees, skills) => {
  const gaps = [];
  const distribution = calculateSkillsDistribution(employees, skills);

  distribution.forEach(({ skillName, count, skillId }) => {
    // No one has this skill
    if (count === 0) {
      gaps.push({
        skill: skillName,
        issue: 'Zero coverage',
        severity: 'high',
        recommendation: 'Consider hiring or training for this skill',
        count: 0
      });
    }
    // Low coverage (less than 3 people)
    else if (count < 3) {
      gaps.push({
        skill: skillName,
        issue: `Only ${count} employee(s)`,
        severity: 'medium',
        recommendation: 'Single point of failure risk',
        count
      });
    }
    // Check for lack of experts
    else {
      const experts = employees.filter(emp =>
        emp.skills.some(s => s.skillId === skillId && s.proficiencyLevel === 'Expert')
      );

      if (experts.length === 0) {
        gaps.push({
          skill: skillName,
          issue: 'No experts',
          severity: 'low',
          recommendation: 'Consider advanced training or mentorship',
          count
        });
      }
    }
  });

  // Sort by severity (high > medium > low) then by skill name
  const severityOrder = { high: 0, medium: 1, low: 2 };
  return gaps.sort((a, b) => {
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return a.skill.localeCompare(b.skill);
  });
};

/**
 * Calculate skills matrix (departments vs skills coverage)
 * @param {Array} employees - Array of employee objects
 * @param {Array} skills - Array of skill objects
 * @param {Array} departments - Array of department strings
 * @returns {Array} - Array of { department, skills: { skillName: percentage } }
 */
export const calculateSkillsMatrix = (employees, skills, departments) => {
  const matrix = [];

  departments.forEach(dept => {
    const deptEmployees = employees.filter(emp => emp.department === dept);
    const deptEmployeeCount = deptEmployees.length;

    if (deptEmployeeCount === 0) return;

    const skillCoverage = {};

    skills.forEach(skill => {
      const employeesWithSkill = deptEmployees.filter(emp =>
        (emp.skills || []).some(s => s.skillId === skill.id)
      );

      skillCoverage[skill.name] = deptEmployeeCount > 0
        ? Math.round((employeesWithSkill.length / deptEmployeeCount) * 100)
        : 0;
    });

    matrix.push({
      department: dept,
      skills: skillCoverage,
      employeeCount: deptEmployeeCount
    });
  });

  return matrix;
};

/**
 * Helper function to filter employees by department
 * @param {Array} employees - Array of employee objects
 * @param {string} department - Department name (empty string for all)
 * @returns {Array} - Filtered employees
 */
export const filterEmployeesByDepartment = (employees, department) => {
  return department ? employees.filter(e => e.department === department) : employees;
};
