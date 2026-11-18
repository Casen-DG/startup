const database = require('./database');

const baseUrl = process.argv[2] || 'http://127.0.0.1:4000';
const email = `test_smoke_${Date.now()}@example.com`;
const password = 'test_smoke_password';
let cookie = '';

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (cookie) headers.Cookie = cookie;
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers });
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) cookie = setCookie.split(';', 1)[0];
  let body = null;
  const text = await response.text();
  if (text) body = JSON.parse(text);
  return { response, body };
}

function expectStatus(result, status, step) {
  if (result.response.status !== status) {
    throw new Error(`${step}: expected HTTP ${status}, received HTTP ${result.response.status}`);
  }
}

async function run() {
  try {
    let result = await request('/api/auth/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    expectStatus(result, 200, 'register');

    result = await request('/api/auth/login', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'wrong-password' }),
    });
    expectStatus(result, 401, 'wrong password');

    result = await request('/api/auth/login', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    expectStatus(result, 200, 'login');

    result = await request('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: email, score: 321, date: 'smoke-test' }),
    });
    expectStatus(result, 200, 'submit score');

    result = await request('/api/scores');
    expectStatus(result, 200, 'get leaderboard');
    if (!result.body.some((score) => score.name === email && score.score === 321)) {
      throw new Error('get leaderboard: submitted score was not returned');
    }

    result = await request('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ healthy: 70, pathogen: 10, duration: 90 }),
    });
    expectStatus(result, 200, 'save settings');

    result = await request('/api/settings');
    expectStatus(result, 200, 'get settings');
    if (result.body.healthy !== 70 || result.body.pathogen !== 10 || result.body.duration !== 90) {
      throw new Error('get settings: saved values were not returned');
    }

    result = await request('/api/auth/logout', { method: 'DELETE' });
    expectStatus(result, 204, 'logout');

    result = await request('/api/scores');
    expectStatus(result, 401, 'unauthorized leaderboard');

    console.log(`Smoke test passed for ${baseUrl}`);
  } finally {
    await database.scoreCollection.deleteMany({ name: email });
    await database.settingsCollection.deleteMany({ email });
    await database.userCollection.deleteMany({ email });
  }
}

run()
  .catch((error) => {
    console.error(`Smoke test failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => {
    setTimeout(() => process.exit(process.exitCode || 0), 0);
  });
