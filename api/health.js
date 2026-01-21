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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let client;

  try {
    client = await getRedisClient();

    // Test connection
    await client.ping();

    // Get all keys
    const keys = await client.keys('*');

    // Get data sizes
    const dataStatus = {};
    for (const key of keys) {
      const value = await client.get(key);
      try {
        const parsed = value ? JSON.parse(value) : null;
        dataStatus[key] = {
          exists: !!value,
          size: value ? value.length : 0,
          itemCount: Array.isArray(parsed) ? parsed.length : (parsed ? 1 : 0),
        };
      } catch {
        dataStatus[key] = {
          exists: !!value,
          size: value ? value.length : 0,
          itemCount: 'N/A (not JSON array)',
        };
      }
    }

    return res.status(200).json({
      status: 'healthy',
      connected: true,
      totalKeys: keys.length,
      keys: keys,
      dataStatus,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    return res.status(500).json({
      status: 'unhealthy',
      connected: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  } finally {
    if (client) {
      await client.quit();
    }
  }
}
