import express from 'express';
import { validateGlobalId } from '../middlewares/validate-global-id';
import TypesActivitysControllers from '../controllers/TypesActivitys-controllers';
import { validateTypesActivitysExis, validateTypesActivitysUpdate, validateUserTypesActivitys } from '../middlewares/typesActivitys';
import { handleInputError } from '../middlewares/validation-global';
import { verifyJWT } from '../middlewares/verify-jwt';

const typesActivitys = express.Router();

typesActivitys.use(verifyJWT)

typesActivitys.param('id', validateGlobalId);
typesActivitys.param('id', validateTypesActivitysExis);


typesActivitys.get('/', TypesActivitysControllers.getAll);

typesActivitys.get('/:id', 
  validateUserTypesActivitys,
  TypesActivitysControllers.getById

);

typesActivitys.put('/:id',
  validateUserTypesActivitys, 
  validateTypesActivitysUpdate,
  handleInputError,
  TypesActivitysControllers.update

);

typesActivitys.delete('/:id', 
  validateUserTypesActivitys,
  TypesActivitysControllers.delete

);


export default typesActivitys; 