import { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { employeesService, skillsService, educationService, isUsingRedis } from '../utils/dataService';
import { initializeSeedData } from '../utils/seedData';
import { exportToCSV } from '../utils/csvExport';
import { normalizeEmployees } from '../utils/employeeModel';
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
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState('');

  // Initialize data from Redis or localStorage
  useEffect(() => {
    const loadData = async () => {
      console.log('=== APPCONTEXT INITIALIZATION START ===');
      console.log(`Storage mode: ${isUsingRedis() ? 'Redis (Cloud)' : 'localStorage (Local)'}`);
      setDataSource(isUsingRedis() ? 'cloud' : 'local');
      setIsLoading(true);

      try {
        // Load data from Redis or localStorage (service handles this automatically)
        const [storedEmployees, storedSkills, storedEducation] = await Promise.all([
          employeesService.getAll(),
          skillsService.getAll(),
          educationService.getAll(),
        ]);

        console.log('Loaded data:');
        console.log('- Employees:', storedEmployees.length);
        console.log('- Skills:', storedSkills.length);
        console.log('- Education:', storedEducation.length);

        if (storedEmployees.length === 0 && storedSkills.length === 0 && storedEducation.length === 0) {
          console.log('No data found - initializing seed data');
          const { skills: seedSkills, education: seedEducation, employees: seedEmployees } = initializeSeedData();
          const normalizedEmployees = normalizeEmployees(seedEmployees);

          console.log('Seed data created:');
          console.log('- Skills:', seedSkills.length);
          console.log('- Education:', seedEducation.length);
          console.log('- Employees:', normalizedEmployees.length);

          // Save seed data
          await Promise.all([
            skillsService.save(seedSkills),
            educationService.save(seedEducation),
            employeesService.save(normalizedEmployees),
          ]);

          setSkillsState(seedSkills);
          setEducationState(seedEducation);
          setEmployeesState(normalizedEmployees);
        } else {
          console.log('Loading existing data');
          // Normalize employees on load to ensure all arrays exist
          const normalizedEmployees = normalizeEmployees(storedEmployees);
          console.log('Normalized employees:', normalizedEmployees.length);
          setEmployeesState(normalizedEmployees);
          setSkillsState(storedSkills);
          setEducationState(storedEducation);
        }

        console.log('=== APPCONTEXT INITIALIZATION COMPLETE ===');
      } catch (error) {
        console.error('=== APPCONTEXT INITIALIZATION FAILED ===');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Employee CRUD operations
  const addEmployee = async (employeeData) => {
    const newEmployee = {
      ...employeeData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [...employees, newEmployee];
    setEmployeesState(updated);
    await employeesService.save(updated);
    return newEmployee;
  };

  const updateEmployee = async (id, employeeData) => {
    const updated = employees.map(emp =>
      emp?.id === id
        ? { ...employeeData, id, createdAt: emp?.createdAt, updatedAt: new Date().toISOString() }
        : emp
    );
    setEmployeesState(updated);
    await employeesService.save(updated);
  };

  const deleteEmployee = async (id) => {
    const updated = employees.filter(emp => emp?.id !== id);
    setEmployeesState(updated);
    await employeesService.save(updated);
  };

  // Skill CRUD operations
  const addSkill = async (skillData) => {
    const newSkill = {
      ...skillData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    const updated = [...skills, newSkill];
    setSkillsState(updated);
    await skillsService.save(updated);
    return newSkill;
  };

  const updateSkill = async (id, skillData) => {
    const updated = skills.map(skill =>
      skill?.id === id ? { ...skillData, id, createdAt: skill?.createdAt } : skill
    );
    setSkillsState(updated);
    await skillsService.save(updated);
  };

  const deleteSkill = async (id) => {
    // Remove skill from all employees first
    const updatedEmployees = employees.map(emp => ({
      ...emp,
      skills: (emp?.skills || []).filter(s => s?.skillId !== id)
    }));
    setEmployeesState(updatedEmployees);
    await employeesService.save(updatedEmployees);

    // Then remove the skill
    const updated = skills.filter(skill => skill?.id !== id);
    setSkillsState(updated);
    await skillsService.save(updated);
  };

  // Education CRUD operations
  const addEducation = async (educationData) => {
    const newEducation = {
      ...educationData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    const updated = [...education, newEducation];
    setEducationState(updated);
    await educationService.save(updated);
    return newEducation;
  };

  const updateEducation = async (id, educationData) => {
    const updated = education.map(edu =>
      edu?.id === id ? { ...educationData, id, createdAt: edu?.createdAt } : edu
    );
    setEducationState(updated);
    await educationService.save(updated);
  };

  const deleteEducation = async (id) => {
    // Remove education from all employees first
    const updatedEmployees = employees.map(emp => ({
      ...emp,
      education: (emp?.education || []).filter(e => e?.educationId !== id)
    }));
    setEmployeesState(updatedEmployees);
    await employeesService.save(updatedEmployees);

    // Then remove the education
    const updated = education.filter(edu => edu?.id !== id);
    setEducationState(updated);
    await educationService.save(updated);
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

  // Reload data (useful after migration)
  const reloadData = async () => {
    setIsLoading(true);
    try {
      const [storedEmployees, storedSkills, storedEducation] = await Promise.all([
        employeesService.getAll(),
        skillsService.getAll(),
        educationService.getAll(),
      ]);

      const normalizedEmployees = normalizeEmployees(storedEmployees);
      setEmployeesState(normalizedEmployees);
      setSkillsState(storedSkills);
      setEducationState(storedEducation);
    } catch (error) {
      console.error('Error reloading data:', error);
    } finally {
      setIsLoading(false);
    }
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
    handleExportCSV,
    isLoading,
    dataSource,
    reloadData,
    isUsingRedis: isUsingRedis(),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
