import express from 'express';
import {
  addTask,
  getTask,
  listTasks,
  removeTask,
  updateTask
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/', listTasks);
router.get('/:id', getTask);
router.post('/', addTask);
router.put('/:id', updateTask);
router.delete('/:id', removeTask);

export default router;

