import { STORAGE_KEYS } from '../constants';

const IS_PRODUCTION = import.meta.env.PROD;
const API_BASE = '/api';

console.log(`📊 Data Service: ${IS_PRODUCTION ? 'Redis (Production)' : 'localStorage (Development)'}`);

// Storage abstraction - uses API in production, localStorage in development
class DataService {
  constructor(key, storageKey) {
    this.key = key;           // API endpoint name (employees, skills, education)
    this.storageKey = storageKey;  // localStorage key (sqc_employees, etc.)
    this.useAPI = IS_PRODUCTION;
  }

  async getAll() {
    if (this.useAPI) {
      try {
        console.log(`[DataService] Fetching ${this.key} from API...`);
        const res = await fetch(`${API_BASE}/${this.key}`);

        if (!res.ok) {
          console.error(`[DataService] API error for ${this.key}:`, res.status);
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        console.log(`[DataService] Loaded ${data[this.key]?.length || 0} ${this.key} from API`);
        return data[this.key] || [];
      } catch (error) {
        console.error(`[DataService] GET ${this.key} failed:`, error);
        // Fallback to localStorage if API fails
        console.log(`[DataService] Falling back to localStorage for ${this.key}`);
        const data = localStorage.getItem(this.storageKey);
        const parsed = data ? JSON.parse(data) : [];
        console.log(`[DataService] Loaded ${parsed.length} ${this.key} from localStorage fallback`);
        return parsed;
      }
    } else {
      console.log(`[DataService] Fetching ${this.key} from localStorage...`);
      const data = localStorage.getItem(this.storageKey);
      const parsed = data ? JSON.parse(data) : [];
      console.log(`[DataService] Loaded ${parsed.length} ${this.key} from localStorage`);
      return parsed;
    }
  }

  async save(items) {
    if (this.useAPI) {
      try {
        console.log(`[DataService] Saving ${items.length} ${this.key} to API...`);
        const res = await fetch(`${API_BASE}/${this.key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ [this.key]: items })
        });

        if (!res.ok) {
          console.error(`[DataService] Save failed for ${this.key}:`, res.status);
          throw new Error(`API error: ${res.status}`);
        }

        console.log(`[DataService] Successfully saved ${items.length} ${this.key} to Redis`);
        // Also save to localStorage as backup
        localStorage.setItem(this.storageKey, JSON.stringify(items));
        return true;
      } catch (error) {
        console.error(`[DataService] POST ${this.key} failed:`, error);
        // Fallback to localStorage if API fails
        console.log(`[DataService] Saving to localStorage as fallback for ${this.key}`);
        localStorage.setItem(this.storageKey, JSON.stringify(items));
        return false;
      }
    } else {
      console.log(`[DataService] Saving ${items.length} ${this.key} to localStorage...`);
      localStorage.setItem(this.storageKey, JSON.stringify(items));
      return true;
    }
  }
}

// Employees Service
export const employeesService = {
  _service: new DataService('employees', STORAGE_KEYS.EMPLOYEES),

  async getAll() {
    try {
      const employees = await this._service.getAll();
      return Array.isArray(employees) ? employees : [];
    } catch (error) {
      console.error('Error getting employees:', error);
      return [];
    }
  },

  async save(employees) {
    try {
      await this._service.save(employees);
      return true;
    } catch (error) {
      console.error('Error saving employees:', error);
      return false;
    }
  },

  async add(employee) {
    const employees = await this.getAll();
    if (!employee.id) employee.id = Date.now().toString();
    employees.push(employee);
    await this.save(employees);
    return employee;
  },

  async update(id, updates) {
    const employees = await this.getAll();
    const index = employees.findIndex(e => e.id === id);
    if (index !== -1) {
      employees[index] = { ...employees[index], ...updates };
      await this.save(employees);
      return employees[index];
    }
    throw new Error('Employee not found');
  },

  async delete(id) {
    const employees = await this.getAll();
    const filtered = employees.filter(e => e.id !== id);
    await this.save(filtered);
    return true;
  }
};

// Skills Service
export const skillsService = {
  _service: new DataService('skills', STORAGE_KEYS.SKILLS),

  async getAll() {
    try {
      const skills = await this._service.getAll();
      return Array.isArray(skills) ? skills : [];
    } catch (error) {
      console.error('Error getting skills:', error);
      return [];
    }
  },

  async save(skills) {
    try {
      await this._service.save(skills);
      return true;
    } catch (error) {
      console.error('Error saving skills:', error);
      return false;
    }
  },

  async add(skill) {
    const skills = await this.getAll();
    if (!skill.id) skill.id = Date.now().toString();
    skills.push(skill);
    await this.save(skills);
    return skill;
  },

  async update(id, updates) {
    const skills = await this.getAll();
    const index = skills.findIndex(s => s.id === id);
    if (index !== -1) {
      skills[index] = { ...skills[index], ...updates };
      await this.save(skills);
      return skills[index];
    }
    throw new Error('Skill not found');
  },

  async delete(id) {
    const skills = await this.getAll();
    const filtered = skills.filter(s => s.id !== id);
    await this.save(filtered);
    return true;
  }
};

// Education Service
export const educationService = {
  _service: new DataService('education', STORAGE_KEYS.EDUCATION),

  async getAll() {
    try {
      const education = await this._service.getAll();
      return Array.isArray(education) ? education : [];
    } catch (error) {
      console.error('Error getting education:', error);
      return [];
    }
  },

  async save(education) {
    try {
      await this._service.save(education);
      return true;
    } catch (error) {
      console.error('Error saving education:', error);
      return false;
    }
  },

  async add(educationItem) {
    const education = await this.getAll();
    if (!educationItem.id) educationItem.id = Date.now().toString();
    education.push(educationItem);
    await this.save(education);
    return educationItem;
  },

  async update(id, updates) {
    const education = await this.getAll();
    const index = education.findIndex(e => e.id === id);
    if (index !== -1) {
      education[index] = { ...education[index], ...updates };
      await this.save(education);
      return education[index];
    }
    throw new Error('Education not found');
  },

  async delete(id) {
    const education = await this.getAll();
    const filtered = education.filter(e => e.id !== id);
    await this.save(filtered);
    return true;
  }
};

// Utility to check if using production API
export const isUsingRedis = () => IS_PRODUCTION;
