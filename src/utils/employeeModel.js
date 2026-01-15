import { v4 as uuidv4 } from 'uuid';

/**
 * Canonical employee data structure
 * Single source of truth for employee shape
 */

/**
 * Create a new empty employee with all required fields
 * Used when adding a new employee
 */
export const createEmptyEmployee = () => ({
  id: uuidv4(),
  name: '',
  email: '',
  role: '',
  department: '',
  hireDate: new Date().toISOString().split('T')[0],
  phone: '',
  location: '',
  aboutMe: '',
  skills: [],
  education: [],
  careerTimeline: [],
  certifications: [],
  projects: [],
  careerNextSteps: '',
  previousExperience: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

/**
 * Create an empty education item
 */
export const createEmptyEducation = () => ({
  id: uuidv4(),
  level: '',
  subject: '',
  institution: '',
  yearCompleted: '',
  status: 'Completed',
  grade: '',
  startDate: '',
  endDate: '',
  notes: ''
});

/**
 * Create an empty career timeline item
 */
export const createEmptyTimelineEntry = () => ({
  id: uuidv4(),
  title: '',
  company: '',
  description: '',
  startDate: '',
  endDate: null,
  status: 'Completed',
  tags: [],
  summary: ''
});

/**
 * Create an empty skill assignment
 */
export const createEmptySkill = (skillId = '') => ({
  skillId,
  proficiencyLevel: 'Beginner',
  notes: ''
});

/**
 * Normalize employee object to ensure all arrays exist
 * and no placeholder values lock fields
 * @param {Object} emp - Raw employee object
 * @returns {Object} - Normalized employee
 */
export const normalizeEmployee = (emp) => {
  if (!emp || typeof emp !== 'object') {
    return createEmptyEmployee();
  }

  return {
    // Core fields
    id: emp.id || uuidv4(),
    name: emp.name || '',
    email: emp.email || '',
    role: emp.role || '',
    department: emp.department || '',
    hireDate: emp.hireDate || new Date().toISOString().split('T')[0],
    phone: emp.phone || '',
    location: emp.location || '',

    // Rich text fields
    aboutMe: emp.aboutMe || '',
    careerNextSteps: emp.careerNextSteps || '',
    previousExperience: emp.previousExperience || '',

    // Arrays - ensure they exist and are arrays
    skills: Array.isArray(emp.skills) ? emp.skills : [],
    education: Array.isArray(emp.education) ? emp.education : [],
    careerTimeline: Array.isArray(emp.careerTimeline) ? emp.careerTimeline : [],
    certifications: Array.isArray(emp.certifications) ? emp.certifications : [],
    projects: Array.isArray(emp.projects) ? emp.projects : [],

    // Metadata
    createdAt: emp.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

/**
 * Normalize an array of employees
 * @param {Array} employees - Array of employee objects
 * @returns {Array} - Normalized employees
 */
export const normalizeEmployees = (employees) => {
  if (!Array.isArray(employees)) return [];
  return employees.map(normalizeEmployee).filter(emp => emp && emp.id);
};

/**
 * Validate employee has required fields
 * @param {Object} emp - Employee object
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
export const validateEmployee = (emp) => {
  const errors = [];

  if (!emp.name || !emp.name.trim()) {
    errors.push('Name is required');
  }

  if (!emp.email || !emp.email.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emp.email)) {
    errors.push('Email must be valid');
  }

  if (!emp.role || !emp.role.trim()) {
    errors.push('Role is required');
  }

  if (!emp.department || !emp.department.trim()) {
    errors.push('Department is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};
