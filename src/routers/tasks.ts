import express from 'express';
import TasksControllers from '../controllers/tasks-controllers';
import { validateGlobalId } from '../middlewares/validate-global-id';
import { query_tasks, userTasksVerify, validateTasksExis, validateTasksInput, validateTasksUpdate } from '../middlewares/tasks';
import { handleInputError } from '../middlewares/validation-global';
import { verifyJWT } from '../middlewares/verify-jwt';

const tasksRouter = express.Router();

tasksRouter.use(verifyJWT);

tasksRouter.param('id', validateGlobalId);
tasksRouter.param('id', validateTasksExis);


tasksRouter.post('/', 
  validateTasksInput,
  handleInputError,
  TasksControllers.create

);

tasksRouter.get('/', 
  query_tasks,
  TasksControllers.getAll
);

tasksRouter.get('/:id', 
  userTasksVerify,
  TasksControllers.getById
);

tasksRouter.put('/:id',
  userTasksVerify, 
  validateTasksUpdate,
  handleInputError,
  TasksControllers.update

);

tasksRouter.delete('/:id', 
  userTasksVerify,
  TasksControllers.delete

);

export default tasksRouter;