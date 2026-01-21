import { createClient } from 'redis';

// Create Redis client
const getRedisClient = async () => {
  const client = createClient({
    url: process.env.REDIS_URL
  });

  await client.connect();
  return client;
};

// Validation function for employees
function validateEmployee(employee) {
  const errors = [];

  if (!employee.name || typeof employee.name !== 'string') {
    errors.push('Name is required and must be a string');
  }

  if (!employee.email || typeof employee.email !== 'string') {
    errors.push('Email is required and must be a string');
  }

  if (!employee.id) {
    errors.push('ID is required');
  }

  // Validate skills array
  if (employee.skills && !Array.isArray(employee.skills)) {
    errors.push('Skills must be an array');
  }

  // Validate education array
  if (employee.education && !Array.isArray(employee.education)) {
    errors.push('Education must be an array');
  }

  // Validate career timeline array
  if (employee.careerTimeline && !Array.isArray(employee.careerTimeline)) {
    errors.push('Career timeline must be an array');
  }

  return errors;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let client;

  try {
    client = await getRedisClient();

    if (req.method === 'GET') {
      // Get all employees
      const data = await client.get('sqc_employees');
      const employees = data ? JSON.parse(data) : [];
      return res.status(200).json({ employees });
    }

    if (req.method === 'POST') {
      const { employees } = req.body;

      // Validate it's an array
      if (!Array.isArray(employees)) {
        return res.status(400).json({ error: 'Employees must be an array' });
      }

      // Validate each employee
      for (const emp of employees) {
        const errors = validateEmployee(emp);
        if (errors.length > 0) {
          return res.status(400).json({
            error: 'Invalid employee data',
            details: errors,
            invalidEmployee: emp.name || emp.id
          });
        }
      }

      // Use Redis transaction for atomic write
      const multi = client.multi();
      multi.set('sqc_employees', JSON.stringify(employees));
      multi.set('sqc_employees:updated', new Date().toISOString());
      multi.set('sqc_employees:count', employees.length.toString());
      await multi.exec();

      return res.status(200).json({ success: true, count: employees.length });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Redis error:', error);
    return res.status(500).json({ error: error.message });
  } finally {
    if (client) {
      await client.quit();
    }
  }
}
