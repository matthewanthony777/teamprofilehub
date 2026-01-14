// Analytics export functions for the SQC Employee Hub

/**
 * Export analytics data to CSV
 * @param {Object} analyticsData - Object containing various analytics datasets
 * @param {string} filename - Filename for the CSV (without extension)
 */
export const exportAnalyticsToCSV = (analyticsData, filename = 'analytics') => {
  const {
    skillsDistribution,
    proficiencyDistribution,
    educationDistribution,
    departmentStats,
    skillsGaps
  } = analyticsData;

  const timestamp = new Date().toISOString().split('T')[0];
  const csvFilename = `${filename}_${timestamp}.csv`;

  // Build CSV content
  let csvContent = '';

  // Skills Distribution Section
  if (skillsDistribution && skillsDistribution.length > 0) {
    csvContent += 'SKILLS DISTRIBUTION\n';
    csvContent += 'Skill Name,Category,Employee Count\n';
    skillsDistribution.forEach(item => {
      csvContent += `"${item.skillName}","${item.category}",${item.count}\n`;
    });
    csvContent += '\n';
  }

  // Proficiency Distribution Section
  if (proficiencyDistribution && proficiencyDistribution.length > 0) {
    csvContent += 'PROFICIENCY DISTRIBUTION\n';
    csvContent += 'Level,Count,Percentage\n';
    proficiencyDistribution.forEach(item => {
      csvContent += `"${item.level}",${item.count},${item.percentage}%\n`;
    });
    csvContent += '\n';
  }

  // Education Distribution Section
  if (educationDistribution && educationDistribution.length > 0) {
    csvContent += 'EDUCATION DISTRIBUTION\n';
    csvContent += 'Category,Count\n';
    educationDistribution.forEach(item => {
      csvContent += `"${item.category}",${item.count}\n`;
    });
    csvContent += '\n';
  }

  // Department Stats Section
  if (departmentStats && departmentStats.length > 0) {
    csvContent += 'DEPARTMENT STATISTICS\n';
    csvContent += 'Department,Employee Count,Total Skills,Average Skills per Employee\n';
    departmentStats.forEach(dept => {
      csvContent += `"${dept.department}",${dept.employeeCount},${dept.totalSkills},${dept.avgSkills}\n`;
    });
    csvContent += '\n';
  }

  // Skills Gaps Section
  if (skillsGaps && skillsGaps.length > 0) {
    csvContent += 'SKILLS GAP ANALYSIS\n';
    csvContent += 'Skill,Issue,Severity,Employee Count,Recommendation\n';
    skillsGaps.forEach(gap => {
      csvContent += `"${gap.skill}","${gap.issue}","${gap.severity}",${gap.count},"${gap.recommendation}"\n`;
    });
    csvContent += '\n';
  }

  // Create and download the CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', csvFilename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/**
 * Export specific chart data to CSV
 * @param {Array} data - Chart data array
 * @param {string} filename - Filename for the CSV
 * @param {Array} headers - Array of header names
 */
export const exportChartDataToCSV = (data, filename, headers) => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  const timestamp = new Date().toISOString().split('T')[0];
  const csvFilename = `${filename}_${timestamp}.csv`;

  // Create CSV content
  let csvContent = '';

  // Add headers
  if (headers && headers.length > 0) {
    csvContent += headers.map(h => `"${h}"`).join(',') + '\n';
  } else {
    // Auto-generate headers from first data object
    const keys = Object.keys(data[0]);
    csvContent += keys.map(k => `"${k}"`).join(',') + '\n';
  }

  // Add data rows
  data.forEach(item => {
    const values = headers
      ? headers.map(h => {
          const value = item[h] || item[h.toLowerCase()] || '';
          return typeof value === 'string' ? `"${value}"` : value;
        })
      : Object.values(item).map(v =>
          typeof v === 'string' ? `"${v}"` : v
        );

    csvContent += values.join(',') + '\n';
  });

  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', csvFilename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
