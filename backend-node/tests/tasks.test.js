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



// Teste ungültige ID
describe('GET /api/tasks', () => {
  it('rejects an invalid task ID', async () => {
    const res = await request(app).get('/api/tasks/123');

    expect(res.status).toBe(400);
  });
});


// Teste Priorität (Bug 2)
describe('GET /api/tasks', () => {
  it('sorts tasks by priority in descending order', async () => {
    await request(app).post('/api/tasks').send({
      title: 'Low priority',
      priority: 2
    });

    await request(app).post('/api/tasks').send({
      title: 'High priority',
      priority: 10
    });

    const res = await request(app)
      .get('/api/tasks?sort=priority&order=desc');

    expect(res.status).toBe(200);
    expect(res.body[0].priority).toBe(10);
    expect(res.body[1].priority).toBe(2);
  });
});

// Teste ungültige Filter
describe('GET /api/tasks', () => {
  it('rejects an invalid status filter', async () => {
    const res = await request(app).get('/api/tasks?status=closed');

    expect(res.status).toBe(400);
  });

  it('rejects a non-numeric minPriority filter', async () => {
    const res = await request(app).get('/api/tasks?minPriority=abc');

    expect(res.status).toBe(400);
  });
});


// Teste Fääligskeitsdatum nach ändern des Titels
describe('PATCH /api/tasks', () => {
  it('keeps the dueDate when updating only the title', async () => {
    const task = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Old title',
        dueDate: '2026-12-20'
      });

    const res = await request(app)
      .patch(`/api/tasks/${task.body.id}`)
      .send({ title: 'New title' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('New title');
    expect(res.body.dueDate).toBe('2026-12-20');
  });
});