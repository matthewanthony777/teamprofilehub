import { STORAGE_KEYS } from '../constants';

const API_BASE = '/api';

export async function migrateLocalStorageToRedis() {
  try {
    console.log('🔄 Starting migration from localStorage to Redis...');

    // Get data from localStorage directly
    const localEmployees = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    const localSkills = localStorage.getItem(STORAGE_KEYS.SKILLS);
    const localEducation = localStorage.getItem(STORAGE_KEYS.EDUCATION);

    const employees = localEmployees ? JSON.parse(localEmployees) : [];
    const skills = localSkills ? JSON.parse(localSkills) : [];
    const education = localEducation ? JSON.parse(localEducation) : [];

    console.log(`Found in localStorage:`);
    console.log(`  - ${employees.length} employees`);
    console.log(`  - ${skills.length} skills`);
    console.log(`  - ${education.length} education entries`);

    if (employees.length === 0 && skills.length === 0 && education.length === 0) {
      return {
        success: true,
        message: 'No data found in localStorage to migrate',
      };
    }

    // Upload to Redis via serverless API
    let migratedEmployees = 0;
    let migratedSkills = 0;
    let migratedEducation = 0;

    if (employees.length > 0) {
      const res = await fetch(`${API_BASE}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employees })
      });
      if (!res.ok) throw new Error('Failed to migrate employees');
      migratedEmployees = employees.length;
      console.log(`✅ Migrated ${migratedEmployees} employees to Redis`);
    }

    if (skills.length > 0) {
      const res = await fetch(`${API_BASE}/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills })
      });
      if (!res.ok) throw new Error('Failed to migrate skills');
      migratedSkills = skills.length;
      console.log(`✅ Migrated ${migratedSkills} skills to Redis`);
    }

    if (education.length > 0) {
      const res = await fetch(`${API_BASE}/education`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ education })
      });
      if (!res.ok) throw new Error('Failed to migrate education');
      migratedEducation = education.length;
      console.log(`✅ Migrated ${migratedEducation} education entries to Redis`);
    }

    console.log('✅ Migration complete!');
    console.log('📡 Data is now synced across all devices via Redis');

    return {
      success: true,
      message: `Migrated ${migratedEmployees} employees, ${migratedSkills} skills, and ${migratedEducation} education entries to cloud`,
      employees: migratedEmployees,
      skills: migratedSkills,
      education: migratedEducation,
    };
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Expose to browser console for manual migration
if (typeof window !== 'undefined') {
  window.migrateToRedis = migrateLocalStorageToRedis;
}
