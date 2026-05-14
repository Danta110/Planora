import {
  createTask,
  deleteTaskById,
  findTaskById,
  getAllTasks,
  updateTaskById
} from '../models/taskModel.js';

export async function listTasks(req, res, next) {
  try {
    const tasks = await getAllTasks();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
}

export async function getTask(req, res, next) {
  try {
    const task = await findTaskById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
}

export async function addTask(req, res, next) {
  try {
    const { title, description = '', status = 'pending' } = req.body;

    if (!title || !title.trim()) {
      res.status(400);
      throw new Error('Task title is required');
    }

    if (!['pending', 'completed'].includes(status)) {
      res.status(400);
      throw new Error('Status must be pending or completed');
    }

    const task = await createTask({
      title: title.trim(),
      description: description.trim(),
      status
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req, res, next) {
  try {
    const existingTask = await findTaskById(req.params.id);

    if (!existingTask) {
      res.status(404);
      throw new Error('Task not found');
    }

    const title = req.body.title ?? existingTask.title;
    const description = req.body.description ?? existingTask.description;
    const status = req.body.status ?? existingTask.status;

    if (!title || !title.trim()) {
      res.status(400);
      throw new Error('Task title is required');
    }

    if (!['pending', 'completed'].includes(status)) {
      res.status(400);
      throw new Error('Status must be pending or completed');
    }

    const task = await updateTaskById(req.params.id, {
      title: title.trim(),
      description: description.trim(),
      status
    });

    res.json(task);
  } catch (error) {
    next(error);
  }
}

export async function removeTask(req, res, next) {
  try {
    const result = await deleteTaskById(req.params.id);

    if (result.changes === 0) {
      res.status(404);
      throw new Error('Task not found');
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
}

