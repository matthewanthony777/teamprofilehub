import { createClient } from 'redis';

export default async function handler(req, res) {
  let client;

  try {
    client = createClient({ url: process.env.REDIS_URL });
    await client.connect();

    const keys = await client.keys('*');
    const data = {};

    for (const key of keys) {
      const value = await client.get(key);
      try {
        data[key] = JSON.parse(value);
      } catch {
        data[key] = value;
      }
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Redis Data Viewer</title>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0a0a0a;
      color: #e5e5e5;
      padding: 2rem;
      margin: 0;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { color: #3b82f6; margin-bottom: 2rem; }
    .stat {
      background: #141414;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
      display: inline-block;
      margin-right: 1rem;
    }
    .stat-label { color: #6b7280; font-size: 0.875rem; }
    .stat-value { color: #fff; font-size: 2rem; font-weight: bold; }
    .key-section {
      background: #141414;
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .key-name { color: #3b82f6; font-weight: 600; margin-bottom: 1rem; }
    pre {
      background: #0a0a0a;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      padding: 1rem;
      overflow-x: auto;
    }
    code { color: #22c55e; font-size: 0.875rem; }
    .refresh-btn {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      margin-bottom: 2rem;
    }
    .refresh-btn:hover { background: #2563eb; }
    .empty { text-align: center; color: #6b7280; padding: 3rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Redis Database Viewer</h1>

    <button class="refresh-btn" onclick="location.reload()">Refresh</button>

    <div>
      <div class="stat">
        <div class="stat-label">Total Keys</div>
        <div class="stat-value">${keys.length}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Database</div>
        <div class="stat-value">Redis</div>
      </div>
    </div>

    <div style="margin-top: 2rem;">
      ${keys.length === 0 ? `
        <div class="empty">
          <h2>No Data Found</h2>
          <p>The Redis database is empty.</p>
          <p>This means either:</p>
          <ul style="text-align: left; display: inline-block; margin-top: 1rem;">
            <li>No data has been added yet</li>
            <li>Migration hasn't run</li>
            <li>Data is stored with different keys</li>
          </ul>
        </div>
      ` : keys.map(key => `
        <div class="key-section">
          <div class="key-name">
            ${key}
            ${Array.isArray(data[key]) ? `<span style="color: #6b7280; font-size: 0.875rem;"> (${data[key].length} items)</span>` : ''}
          </div>
          <pre><code>${JSON.stringify(data[key], null, 2)}</code></pre>
        </div>
      `).join('')}
    </div>

    <p style="margin-top: 2rem; color: #6b7280; text-align: center;">
      Last updated: ${new Date().toLocaleString()}
    </p>
  </div>
</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);

  } catch (error) {
    const errorHtml = `
<!DOCTYPE html>
<html>
<head><title>Redis Error</title></head>
<body style="font-family: sans-serif; padding: 2rem; background: #0a0a0a; color: #e5e5e5;">
  <h1 style="color: #ef4444;">Redis Connection Error</h1>
  <p><strong>Error:</strong> ${error.message}</p>
  <pre style="background: #141414; padding: 1rem; border-radius: 8px; overflow-x: auto;">${error.stack}</pre>
  <p style="margin-top: 2rem;">
    <strong>Possible fixes:</strong>
  </p>
  <ul>
    <li>Check that REDIS_URL is set in Vercel Environment Variables</li>
    <li>Verify the connection string is correct</li>
    <li>Ensure Redis database is running</li>
  </ul>
</body>
</html>
    `;
    res.setHeader('Content-Type', 'text/html');
    return res.status(500).send(errorHtml);

  } finally {
    if (client) {
      await client.quit();
    }
  }
}
