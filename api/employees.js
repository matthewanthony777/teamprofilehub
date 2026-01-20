import { createClient } from 'redis';

// Create Redis client
const getRedisClient = async () => {
  const client = createClient({
    url: process.env.REDIS_URL
  });

  await client.connect();
  return client;
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
      // Save all employees
      const { employees } = req.body;
      await client.set('sqc_employees', JSON.stringify(employees));
      return res.status(200).json({ success: true });
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
