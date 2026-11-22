const express = require('express');
const taskService = require('../services/taskService');

const router = express.Router();

// Express 4 does not forward rejected promises to the error handler - this wrapper does.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const tasks = await taskService.listTasks(req.query);
    res.json(tasks);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const task = await taskService.createTask(req.body);
    console.log(task)
    res.status(201).json(task);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const task = await taskService.getTask(req.params.id);
    res.json(task);
  })
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const task = await taskService.updateTask(req.params.id, req.body);
    res.json(task);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await taskService.deleteTask(req.params.id);
    res.status(204).end();
  })
);

module.exports = router;
