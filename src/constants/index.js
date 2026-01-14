export const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const SKILL_CATEGORIES = ['Technical', 'Soft Skills', 'Certifications', 'Languages'];

export const DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'Design',
  'Product',
  'Customer Support'
];

export const EDUCATION_LEVELS = [
  'High School',
  'Associate Degree',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'Doctorate (PhD)',
  'Professional Certification',
  'Bootcamp',
  'Online Course'
];

export const EDUCATION_STATUSES = ['In Progress', 'Completed', 'Discontinued'];

export const EDUCATION_LEVEL_COLORS = {
  'High School': 'bg-gray-100 text-gray-800 border-gray-200',
  'Associate Degree': 'bg-blue-100 text-blue-800 border-blue-200',
  'Bachelor\'s Degree': 'bg-green-100 text-green-800 border-green-200',
  'Master\'s Degree': 'bg-purple-100 text-purple-800 border-purple-200',
  'Doctorate (PhD)': 'bg-amber-100 text-amber-800 border-amber-200',
  'Professional Certification': 'bg-orange-100 text-orange-800 border-orange-200',
  'Bootcamp': 'bg-pink-100 text-pink-800 border-pink-200',
  'Online Course': 'bg-teal-100 text-teal-800 border-teal-200'
};

// Legacy - kept for backward compatibility with existing data
export const EDUCATION_CATEGORIES = ['Degree', 'Certification', 'Course', 'Bootcamp', 'Self-taught'];

export const STORAGE_KEYS = {
  EMPLOYEES: 'sqc_employees',
  SKILLS: 'sqc_skills',
  EDUCATION: 'sqc_education',
  APP_VERSION: 'sqc_app_version'
};

export const PROFICIENCY_COLORS = {
  Beginner: 'bg-gray-200 text-gray-800',
  Intermediate: 'bg-blue-200 text-blue-800',
  Advanced: 'bg-green-200 text-green-800',
  Expert: 'bg-purple-200 text-purple-800'
};

export const VIEWS = {
  DASHBOARD: 'dashboard',
  EMPLOYEES: 'employees',
  EMPLOYEE_DETAIL: 'employee-detail',
  EMPLOYEE_FORM: 'employee-form',
  SKILLS: 'skills',
  EDUCATION: 'education',
  ANALYTICS: 'analytics'
};

export const CHART_COLORS = {
  primary: '#6366f1',
  secondary: '#10b981',
  accent: '#f59e0b',
  info: '#3b82f6',
  danger: '#ef4444',
  purple: '#8b5cf6',
  pink: '#ec4899',
  teal: '#14b8a6'
};

export const TIMELINE_STATUSES = ['Completed', 'In Progress', 'On Hold'];

export const TIMELINE_STATUS_COLORS = {
  'Completed': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
  'On Hold': 'bg-gray-100 text-gray-800 border-gray-200'
};

export const DEFAULT_TIMELINE_TAGS = [
  'Frontend',
  'Backend',
  'Full Stack',
  'High Priority',
  'Low Priority',
  'Research',
  'Development',
  'Testing',
  'Deployment',
  'Maintenance',
  'Leadership',
  'Team Collaboration',
  'Client Facing',
  'Internal Tools'
];
