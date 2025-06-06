import type { Request, Response, NextFunction } from 'express';
import { param, body, validationResult, query } from 'express-validator';
import SportsActivity from '../models/SportsActivities';

declare global{
  namespace Express{
    interface Request{
      sports_activities?: SportsActivity
    }
  }
}

export async function validateSportsActivitiesInput( req: Request, res: Response, next: NextFunction ): Promise<void> {
  await body('duration')
    .notEmpty().withMessage('La duracion de la activida no puede ir vacia')
    .custom(value => typeof value === 'string').withMessage('La duracion debe de venir en formato String con detalles ej: 30:00 min de trote y 1:00hr de Calistenia')
    .run(req)
  await body('intensity')
    .notEmpty().withMessage('La intencidad de la actividad no puede ir vacia Ej: "leve","moderada","alta","extrema" ')
    .isIn(['leve','moderada','alta','extrema']).withMessage("La intensidad no es valida Ej: 'leve','moderada','alta','extrema'")
    .run(req)
  
  await body('typesActivity')
    .isArray({min: 1}).withMessage('Los tipos de Actividad no pueden ir vacios')
    .run(req)
  await body('typesActivity.*.name')
    .notEmpty().withMessage('El nombre de la actividad es Requerida')
    .isLength({min: 2}).withMessage('El nombre de la actividad es muy corto')
    .run(req)
  await body('typesActivity.*.category')
    .notEmpty().withMessage('La categoria de la actividad es requerida Ej: "cardio","fuerza","flexibilidad" ')
    .isIn(['cardio','fuerza','flexibilidad'])
    .run(req)
  next();
};

export async function validateSportsActivitiesupdate( req: Request, res: Response, next: NextFunction ): Promise<void> {
  await body('duration')
    .notEmpty().withMessage('La duracion de la activida no puede ir vacia')
    .custom(value => typeof value === 'string').withMessage('La duracion debe de venir en formato String con detalles ej: 30:00 min de trote y 1:00hr de Calistenia')
    .run(req)
  await body('intensity')
    .notEmpty().withMessage('La intencidad de la actividad no puede ir vacia Ej: "leve","moderada","alta","extrema" ')
    .isIn(['leve','moderada','alta','extrema']).withMessage("La intensidad no es valida Ej: 'leve','moderada','alta','extrema'")
    .run(req)
  next();  
};

export async function query_sportsActivities( req: Request, res: Response, next: NextFunction ): Promise<void> {
  await query('intensidad')
    .optional()
    .custom(value => typeof value === 'string').withMessage('La intencidad debe de venir en formato String')
    .isIn(['leve','moderada','alta','extrema']).withMessage('La intensidad no es valida Ej: "leve","moderada","alta","extrema" ')
    .run(req)
  await query('limit')
    .optional()
    .isInt({min: 1}).withMessage('La Cantidad no es valida')
    .run(req)  
  const errror = validationResult(req);
  if (!errror.isEmpty()) {
    res.status(400).json({msg: errror.array()});
    return;
  };
  next();  
};

export async function validateSportsAtivitiesExis( req: Request, res: Response, next: NextFunction ): Promise<void> {
  const id = req.params.id;
  try {
    const sportsActivities = await SportsActivity.findByPk(id);
    if (!sportsActivities) {
      res.status(200).json({msg: `No se entro una acitividad deportiva con ID ${id}`});
      return;
    };

    req.sports_activities=sportsActivities;
    next();

  } catch (error) {
    console.error('algo salio mal',error);
    res.status(500).json({msg: 'algo salio mal'});
    return;
  }
};

export async function validateUserSpotsActivities( req: Request, res: Response, next: NextFunction ): Promise<void> {
  if (!req.user) {
    res.status(401).json({msg: 'No Autenticado'});
    return;
  };

  if (req.sports_activities.userId !== req.user.id) {
    res.status(409).json({msg: 'Esta actividad pertenese a otro Usuario, no estas Autorizado para realizar esta accion'});
    return;
  };
  next();
};


