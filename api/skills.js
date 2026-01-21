import { createClient } from 'redis';

const getRedisClient = async () => {
  const client = createClient({
    url: process.env.REDIS_URL
  });

  await client.connect();
  return client;
};

// Validation function for skills
function validateSkill(skill) {
  const errors = [];

  if (!skill.id) {
    errors.push('ID is required');
  }

  if (!skill.name || typeof skill.name !== 'string') {
    errors.push('Name is required and must be a string');
  }

  if (!skill.category || typeof skill.category !== 'string') {
    errors.push('Category is required and must be a string');
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
      const data = await client.get('sqc_skills');
      const skills = data ? JSON.parse(data) : [];
      return res.status(200).json({ skills });
    }

    if (req.method === 'POST') {
      const { skills } = req.body;

      // Validate it's an array
      if (!Array.isArray(skills)) {
        return res.status(400).json({ error: 'Skills must be an array' });
      }

      // Validate each skill
      for (const skill of skills) {
        const errors = validateSkill(skill);
        if (errors.length > 0) {
          return res.status(400).json({
            error: 'Invalid skill data',
            details: errors,
            invalidSkill: skill.name || skill.id
          });
        }
      }

      // Use Redis transaction for atomic write
      const multi = client.multi();
      multi.set('sqc_skills', JSON.stringify(skills));
      multi.set('sqc_skills:updated', new Date().toISOString());
      multi.set('sqc_skills:count', skills.length.toString());
      await multi.exec();

      return res.status(200).json({ success: true, count: skills.length });
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
