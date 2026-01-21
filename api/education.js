import { createClient } from 'redis';

const getRedisClient = async () => {
  const client = createClient({
    url: process.env.REDIS_URL
  });

  await client.connect();
  return client;
};

// Validation function for education
function validateEducation(edu) {
  const errors = [];

  if (!edu.id) {
    errors.push('ID is required');
  }

  if (!edu.institution || typeof edu.institution !== 'string') {
    errors.push('Institution is required and must be a string');
  }

  return errors;
}

export default async function handler(req, res) {
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
      const data = await client.get('sqc_education');
      const education = data ? JSON.parse(data) : [];
      return res.status(200).json({ education });
    }

    if (req.method === 'POST') {
      const { education } = req.body;

      // Validate it's an array
      if (!Array.isArray(education)) {
        return res.status(400).json({ error: 'Education must be an array' });
      }

      // Validate each education entry
      for (const edu of education) {
        const errors = validateEducation(edu);
        if (errors.length > 0) {
          return res.status(400).json({
            error: 'Invalid education data',
            details: errors,
            invalidEducation: edu.institution || edu.id
          });
        }
      }

      // Use Redis transaction for atomic write
      const multi = client.multi();
      multi.set('sqc_education', JSON.stringify(education));
      multi.set('sqc_education:updated', new Date().toISOString());
      multi.set('sqc_education:count', education.length.toString());
      await multi.exec();

      return res.status(200).json({ success: true, count: education.length });
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
