import express from 'express';
import LearningControllers from '../controllers/Learning-controllers';
import { validateGlobalId } from '../middlewares/validate-global-id';
import { query_learning, validateLearningExis, validateLearningInput, verifyUserLearning } from '../middlewares/learning';
import { handleInputError } from '../middlewares/validation-global';
import { verifyJWT } from '../middlewares/verify-jwt';

const learningRouter = express.Router();

learningRouter.use(verifyJWT);

learningRouter.param('id', validateGlobalId);
learningRouter.param('id', validateLearningExis);


learningRouter.post('/', 
  validateLearningInput,
  handleInputError,
  LearningControllers.creata

);

learningRouter.get('/', 
  query_learning,
  LearningControllers.getAll

);

learningRouter.get('/:id', 
  verifyUserLearning,
  LearningControllers.getById

);

learningRouter.put('/:id', 
  verifyUserLearning,
  validateLearningInput,
  handleInputError,
  LearningControllers.update

);

learningRouter.delete('/:id', 
  verifyUserLearning,
  LearningControllers.delete

);

export default learningRouter;