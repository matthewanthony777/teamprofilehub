export const exportToCSV = (employees, skills, education) => {
  // Create skill lookup map
  const skillMap = skills.reduce((acc, skill) => {
    acc[skill.id] = skill.name;
    return acc;
  }, {});

  // Create education lookup map
  const educationMap = education.reduce((acc, edu) => {
    acc[edu.id] = `${edu.degree} in ${edu.field} from ${edu.institution} (${edu.year})`;
    return acc;
  }, {});

  // CSV headers
  const headers = [
    'Name',
    'Role',
    'Department',
    'Email',
    'Hire Date',
    'Phone',
    'About Me',
    'Skills',
    'Education',
    'Career Timeline',
    'Career Next Steps',
    'Previous Experience'
  ];

  // Convert employees to CSV rows
  const rows = employees.map(emp => {
    const employeeSkills = (emp.skills || [])
      .map(s => `${skillMap[s.skillId]} (${s.proficiencyLevel})`)
      .join('; ');

    const employeeEducation = (emp.education || [])
      .map(e => educationMap[e.educationId])
      .filter(Boolean)
      .join('; ');

    const timelineSummary = (emp.careerTimeline || [])
      .map(t => `${t.period}: ${t.title}`)
      .join(' | ');

    return [
      emp.name,
      emp.role,
      emp.department,
      emp.email,
      emp.hireDate,
      emp.phone || '',
      emp.aboutMe || '',
      employeeSkills,
      employeeEducation,
      timelineSummary,
      emp.careerNextSteps || '',
      emp.previousExperience || ''
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `sqc-employees-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL
  URL.revokeObjectURL(url);
};
