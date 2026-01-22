import { createClient } from 'redis';

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const diagnostics = {
    timestamp: new Date().toISOString(),
    checks: [],
    status: 'unknown',
  };

  // Check 1: Environment variable exists
  if (!process.env.REDIS_URL) {
    diagnostics.checks.push({
      name: 'REDIS_URL Environment Variable',
      status: 'FAILED',
      message: 'REDIS_URL is not set in environment variables',
      fix: 'Add REDIS_URL to Vercel Environment Variables',
    });
    diagnostics.status = 'FAILED';
    return res.status(500).json(diagnostics);
  }

  diagnostics.checks.push({
    name: 'REDIS_URL Environment Variable',
    status: 'PASSED',
    message: 'REDIS_URL is configured',
    value: process.env.REDIS_URL.substring(0, 30) + '...',
  });

  let client;

  try {
    // Check 2: Can create client
    client = createClient({
      url: process.env.REDIS_URL,
    });

    diagnostics.checks.push({
      name: 'Redis Client Creation',
      status: 'PASSED',
      message: 'Client created successfully',
    });

    // Check 3: Can connect
    await client.connect();

    diagnostics.checks.push({
      name: 'Redis Connection',
      status: 'PASSED',
      message: 'Connected to Redis successfully',
    });

    // Check 4: Can ping
    const pingResult = await client.ping();

    diagnostics.checks.push({
      name: 'Redis Ping',
      status: 'PASSED',
      message: `Ping response: ${pingResult}`,
    });

    // Check 5: List all keys
    const keys = await client.keys('*');

    diagnostics.checks.push({
      name: 'Database Keys',
      status: 'PASSED',
      message: `Found ${keys.length} keys`,
      keys: keys,
    });

    // Check 6: Get data from each key
    const data = {};
    for (const key of keys) {
      const value = await client.get(key);
      try {
        data[key] = JSON.parse(value);
      } catch {
        data[key] = value;
      }
    }

    diagnostics.data = data;
    diagnostics.dataSize = JSON.stringify(data).length;

    // Check 7: Test write
    const testKey = 'test:connection';
    const testValue = { test: true, timestamp: new Date().toISOString() };
    await client.set(testKey, JSON.stringify(testValue));
    const readBack = await client.get(testKey);

    diagnostics.checks.push({
      name: 'Write/Read Test',
      status: 'PASSED',
      message: 'Successfully wrote and read test data',
      testKey: testKey,
      wrote: testValue,
      read: JSON.parse(readBack),
    });

    // Clean up test key
    await client.del(testKey);

    diagnostics.status = 'HEALTHY';

    return res.status(200).json(diagnostics);

  } catch (error) {
    diagnostics.checks.push({
      name: 'Connection Error',
      status: 'FAILED',
      message: error.message,
      stack: error.stack,
    });

    diagnostics.status = 'FAILED';
    diagnostics.error = {
      message: error.message,
      code: error.code,
      stack: error.stack,
    };

    return res.status(500).json(diagnostics);

  } finally {
    if (client) {
      try {
        await client.quit();
      } catch (e) {
        console.error('Error closing client:', e);
      }
    }
  }
}
