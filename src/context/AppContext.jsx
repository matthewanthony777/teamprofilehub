import { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getEmployees, setEmployees, getSkills, setSkills, getEducation, setEducation } from '../utils/storage';
import { initializeSeedData } from '../utils/seedData';
import { exportToCSV } from '../utils/csvExport';
import { VIEWS } from '../constants';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [employees, setEmployeesState] = useState([]);
  const [skills, setSkillsState] = useState([]);
  const [education, setEducationState] = useState([]);
  const [currentView, setCurrentView] = useState(VIEWS.DASHBOARD);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    role: '',
    skills: []
  });
  const [analyticsFilters, setAnalyticsFilters] = useState({
    department: ''
  });

  // Initialize data from localStorage or seed data
  useEffect(() => {
    const storedEmployees = getEmployees();
    const storedSkills = getSkills();
    const storedEducation = getEducation();

    if (storedEmployees.length === 0 && storedSkills.length === 0 && storedEducation.length === 0) {
      const { skills: seedSkills, education: seedEducation, employees: seedEmployees } = initializeSeedData();
      setSkillsState(seedSkills);
      setEducationState(seedEducation);
      setEmployeesState(seedEmployees);
      setSkills(seedSkills);
      setEducation(seedEducation);
      setEmployees(seedEmployees);
    } else {
      setEmployeesState(storedEmployees);
      setSkillsState(storedSkills);
      setEducationState(storedEducation);
    }
  }, []);

  // Employee CRUD operations
  const addEmployee = (employeeData) => {
    const newEmployee = {
      ...employeeData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [...employees, newEmployee];
    setEmployeesState(updated);
    setEmployees(updated);
    return newEmployee;
  };

  const updateEmployee = (id, employeeData) => {
    const updated = employees.map(emp =>
      emp?.id === id
        ? { ...employeeData, id, createdAt: emp?.createdAt, updatedAt: new Date().toISOString() }
        : emp
    );
    setEmployeesState(updated);
    setEmployees(updated);
  };

  const deleteEmployee = (id) => {
    const updated = employees.filter(emp => emp?.id !== id);
    setEmployeesState(updated);
    setEmployees(updated);
  };

  // Skill CRUD operations
  const addSkill = (skillData) => {
    const newSkill = {
      ...skillData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    const updated = [...skills, newSkill];
    setSkillsState(updated);
    setSkills(updated);
    return newSkill;
  };

  const updateSkill = (id, skillData) => {
    const updated = skills.map(skill =>
      skill?.id === id ? { ...skillData, id, createdAt: skill?.createdAt } : skill
    );
    setSkillsState(updated);
    setSkills(updated);
  };

  const deleteSkill = (id) => {
    // Remove skill from all employees first
    const updatedEmployees = employees.map(emp => ({
      ...emp,
      skills: (emp?.skills || []).filter(s => s?.skillId !== id)
    }));
    setEmployeesState(updatedEmployees);
    setEmployees(updatedEmployees);

    // Then remove the skill
    const updated = skills.filter(skill => skill?.id !== id);
    setSkillsState(updated);
    setSkills(updated);
  };

  // Education CRUD operations
  const addEducation = (educationData) => {
    const newEducation = {
      ...educationData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    const updated = [...education, newEducation];
    setEducationState(updated);
    setEducation(updated);
    return newEducation;
  };

  const updateEducation = (id, educationData) => {
    const updated = education.map(edu =>
      edu?.id === id ? { ...educationData, id, createdAt: edu?.createdAt } : edu
    );
    setEducationState(updated);
    setEducation(updated);
  };

  const deleteEducation = (id) => {
    // Remove education from all employees first
    const updatedEmployees = employees.map(emp => ({
      ...emp,
      education: (emp?.education || []).filter(e => e?.educationId !== id)
    }));
    setEmployeesState(updatedEmployees);
    setEmployees(updatedEmployees);

    // Then remove the education
    const updated = education.filter(edu => edu?.id !== id);
    setEducationState(updated);
    setEducation(updated);
  };

  // Search and filter
  const getFilteredEmployees = () => {
    return employees.filter(emp => {
      // Skip invalid employees
      if (!emp) return false;

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = emp?.name?.toLowerCase().includes(query) || false;
        const matchesEmail = emp?.email?.toLowerCase().includes(query) || false;
        const matchesRole = emp?.role?.toLowerCase().includes(query) || false;

        if (!matchesName && !matchesEmail && !matchesRole) {
          return false;
        }
      }

      // Department filter
      if (filters.department && emp?.department !== filters.department) {
        return false;
      }

      // Role filter
      if (filters.role && emp?.role !== filters.role) {
        return false;
      }

      // Skills filter (employee must have ALL selected skills)
      if (filters.skills.length > 0) {
        const empSkillIds = (emp?.skills || []).map(s => s?.skillId).filter(Boolean);
        const hasAllSkills = filters.skills.every(skillId => empSkillIds.includes(skillId));
        if (!hasAllSkills) return false;
      }

      return true;
    });
  };

  // Export
  const handleExportCSV = () => {
    const filteredEmployees = getFilteredEmployees();
    exportToCSV(filteredEmployees, skills, education);
  };

  const value = {
    employees,
    skills,
    education,
    currentView,
    setCurrentView,
    selectedEmployee,
    setSelectedEmployee,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    analyticsFilters,
    setAnalyticsFilters,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addSkill,
    updateSkill,
    deleteSkill,
    addEducation,
    updateEducation,
    deleteEducation,
    getFilteredEmployees,
    handleExportCSV
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
