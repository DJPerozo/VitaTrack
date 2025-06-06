import express from 'express';
import ProjectsControllers from '../controllers/Projects-controllers';
import { validateGlobalId } from '../middlewares/validate-global-id';
import { query_projects, UserProject, validateProjectExis, validateProjectInput, validateProjectUpdate } from '../middlewares/projects';
import { handleInputError } from '../middlewares/validation-global';
import { verifyJWT } from '../middlewares/verify-jwt';

const projectRouter = express.Router();
projectRouter.use(verifyJWT)

projectRouter.param('id', validateGlobalId);
projectRouter.param('id', validateProjectExis);


projectRouter.post('/', 
  validateProjectInput,
  handleInputError,
  ProjectsControllers.create

);

projectRouter.get('/', 
  query_projects,
  ProjectsControllers.getAll
);

projectRouter.get('/:id', 
  UserProject,  
  ProjectsControllers.getById
);

projectRouter.put('/:id', 
  validateProjectUpdate,
  handleInputError,
  UserProject,
  ProjectsControllers.update

);

projectRouter.delete('/:id', 
  UserProject,
  ProjectsControllers.delete

);

export default projectRouter;