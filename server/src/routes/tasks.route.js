import Router from 'express';
import getAllTasksController from '../controllers/task/getAllTasks.controller.js';
import createTaskController from '../controllers/task/createTask.controller.js';
import updateTaskController from '../controllers/task/updateTask.controller.js';
import updateTaskStatusController from '../controllers/task/updateTaskStatus.controller.js';
import deleteTaskController from '../controllers/task/deleteTask.controller.js';

const router = Router();

router.get('/', getAllTasksController);
router.post('/', createTaskController);
router.put('/:id', updateTaskController);
router.patch('/:id/status', updateTaskStatusController);
router.delete('/:id', deleteTaskController);

export default router;