import { STORAGE_KEYS } from '../constants';

export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

export const getEmployees = () => storage.get(STORAGE_KEYS.EMPLOYEES) || [];
export const setEmployees = (employees) => storage.set(STORAGE_KEYS.EMPLOYEES, employees);

export const getSkills = () => storage.get(STORAGE_KEYS.SKILLS) || [];
export const setSkills = (skills) => storage.set(STORAGE_KEYS.SKILLS, skills);

export const getEducation = () => storage.get(STORAGE_KEYS.EDUCATION) || [];
export const setEducation = (education) => storage.set(STORAGE_KEYS.EDUCATION, education);
