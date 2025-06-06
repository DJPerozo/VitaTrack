import express from 'express';
import { validateGlobalId } from '../middlewares/validate-global-id';
import SportsActivities from '../controllers/SportsActivities-controller';
import { query_sportsActivities, validateSportsActivitiesInput, validateSportsActivitiesupdate, validateSportsAtivitiesExis, validateUserSpotsActivities } from '../middlewares/sportsActivities';
import { handleInputError } from '../middlewares/validation-global';
import { verify } from 'jsonwebtoken';
import { verifyJWT } from '../middlewares/verify-jwt';


const sportsActivities = express.Router();
sportsActivities.use(verifyJWT)

sportsActivities.param('id', validateGlobalId);
sportsActivities.param('id', validateSportsAtivitiesExis);


sportsActivities.post('/', 
  validateSportsActivitiesInput,
  handleInputError,
  SportsActivities.create
);

sportsActivities.get('/', 
  query_sportsActivities,
  SportsActivities.getAll

);

sportsActivities.get('/:id', 
  validateUserSpotsActivities,
  SportsActivities.getById

);

sportsActivities.put('/:id', 
  validateSportsActivitiesupdate,
  handleInputError,
  validateUserSpotsActivities,
  SportsActivities.update

);

sportsActivities.delete('/:id', 
  validateUserSpotsActivities,
  SportsActivities.delete

);

export default sportsActivities;