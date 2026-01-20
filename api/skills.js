import { createClient } from 'redis';

const getRedisClient = async () => {
  const client = createClient({
    url: process.env.REDIS_URL
  });

  await client.connect();
  return client;
};

export default async function handler(req, res) {
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
      const data = await client.get('sqc_skills');
      const skills = data ? JSON.parse(data) : [];
      return res.status(200).json({ skills });
    }

    if (req.method === 'POST') {
      const { skills } = req.body;
      await client.set('sqc_skills', JSON.stringify(skills));
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
