const request = require('supertest');

// Always use the in-memory database for tests
delete process.env.MONGODB_URI;

const app = require('../src/app');
const { connectDb, disconnectDb } = require('../src/db');
const Task = require('../src/models/task');

beforeAll(async () => {
  await connectDb();
});

afterAll(async () => {
  await disconnectDb();
});

beforeEach(async () => {
  await Task.deleteMany({});
});

// Example test - use it as a template for your own tests.
describe('POST /api/tasks', () => {
  it('creates a task', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'Write tests' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Write tests');
    expect(res.body.status).toBe('open');
    expect(res.body.id).toBeDefined();
  });
});
