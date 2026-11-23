const request = require("supertest");

// Always use the in-memory database for tests
delete process.env.MONGODB_URI;

const app = require("../src/app");
const { connectDb, disconnectDb } = require("../src/db");
const Task = require("../src/models/task");

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
describe("POST /api/tasks", () => {
  it("creates a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "Write tests" });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Write tests");
    expect(res.body.status).toBe("open");
    expect(res.body.id).toBeDefined();
  });
});



// Legt einen Task an und stellt sicher, dass das Setup selbst geklappt hat
async function createTask(body) {
  const res = await request(app).post("/api/tasks").send(body);
  expect(res.status).toBe(201);
  return res.body;
}

// Bug 6
describe("PATCH /api/tasks/:id", () => {
  it("keeps the dueDate when updating only the title", async () => {
    const task = await createTask({ title: "Old title", dueDate: "2026-12-20" });

    const res = await request(app)
      .patch(`/api/tasks/${task.id}`)
      .send({ title: "New title" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("New title");
    expect(res.body.dueDate).toBe("2026-12-20");
  });
});

// Bug 5 & 7
describe("/api/tasks/:id", () => {
  it.each(["get", "patch", "delete"])(
    "%s rejects an invalid task ID",
    async (method) => {
      const res = await request(app)[method]("/api/tasks/123").send({ title: "x" });

      expect(res.status).toBe(400);
    },
  );
});

describe("GET /api/tasks", () => {
  // Bug 2
  it("sorts by priority descending by default", async () => {
    await createTask({ title: "A", priority: 2 });
    await createTask({ title: "B", priority: 10 });
    await createTask({ title: "C", priority: 5 });

    const res = await request(app).get("/api/tasks");

    expect(res.status).toBe(200);
    expect(res.body.map((t) => t.priority)).toEqual([10, 5, 2]);
  });

  //Filtern und Sortieren
  it("combines status, minPriority and dueDate sorting", async () => {
    const done = await createTask({ title: "done-high", priority: 9 });
    await request(app).patch(`/api/tasks/${done.id}`).send({ status: "done" });
    await createTask({ title: "open-low", priority: 2 });
    await createTask({ title: "open-high", priority: 8, dueDate: "2026-12-31" });
    await createTask({ title: "open-mid", priority: 7, dueDate: "2026-01-01" });

    const res = await request(app).get(
      "/api/tasks?status=open&minPriority=7&sort=dueDate&order=asc",
    );

    expect(res.body.map((t) => t.title)).toEqual(["open-mid", "open-high"]);
  });
});