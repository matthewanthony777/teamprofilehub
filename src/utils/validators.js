export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  if (!phone) return true; // Phone is optional
  const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return re.test(phone);
};

export const validateEmployee = (employee) => {
  const errors = {};

  if (!employee.name || employee.name.trim() === '') {
    errors.name = 'Name is required';
  }

  if (!employee.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(employee.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!employee.role || employee.role.trim() === '') {
    errors.role = 'Role is required';
  }

  if (!employee.department) {
    errors.department = 'Department is required';
  }

  if (!employee.hireDate) {
    errors.hireDate = 'Hire date is required';
  }

  if (employee.phone && !validatePhone(employee.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (employee.aboutMe && employee.aboutMe.length > 500) {
    errors.aboutMe = 'About Me must be 500 characters or less';
  }

  if (employee.careerNextSteps && employee.careerNextSteps.length > 300) {
    errors.careerNextSteps = 'Career Next Steps must be 300 characters or less';
  }

  if (employee.previousExperience && employee.previousExperience.length > 300) {
    errors.previousExperience = 'Previous Experience must be 300 characters or less';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateSkill = (skill) => {
  const errors = {};

  if (!skill.name || skill.name.trim() === '') {
    errors.name = 'Skill name is required';
  }

  if (!skill.category) {
    errors.category = 'Category is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateEducation = (education) => {
  const errors = {};

  if (!education.institution || education.institution.trim() === '') {
    errors.institution = 'Institution name is required';
  }

  if (!education.degree || education.degree.trim() === '') {
    errors.degree = 'Degree/Qualification is required';
  }

  if (!education.field || education.field.trim() === '') {
    errors.field = 'Field of study is required';
  }

  if (!education.year) {
    errors.year = 'Year is required';
  }

  if (!education.status) {
    errors.status = 'Status is required';
  }

  if (!education.category) {
    errors.category = 'Category is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateTimelineEntry = (entry) => {
  const errors = {};

  // Support both old (period) and new (startDate) formats
  if (!entry.startDate && !entry.period) {
    errors.startDate = 'Start date is required';
  }

  if (entry.startDate && !entry.startDate.trim()) {
    errors.startDate = 'Start date is required';
  }

  // Validate end date is after start date
  if (entry.startDate && entry.endDate) {
    const start = new Date(entry.startDate);
    const end = new Date(entry.endDate);

    if (end < start) {
      errors.endDate = 'End date must be after start date';
    }
  }

  if (!entry.title || entry.title.trim() === '') {
    errors.title = 'Title is required';
  }

  if (!entry.description || entry.description.trim() === '') {
    errors.description = 'Description is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
