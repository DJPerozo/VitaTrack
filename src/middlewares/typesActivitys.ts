import type { Request, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';
import TypesActivity from '../models/TypesActivity';

declare global{
  namespace Express {
    interface Request{
      types_activitys?: TypesActivity
    }
  }
}

export async function validateTypesActivitysExis( req: Request, res: Response, next: NextFunction ): Promise<void> {
  const id = req.params.id;
  try {
    const typesActivity = await TypesActivity.findByPk(id);
    if (!typesActivity) {
      res.status(404).json({msg: `No se encontro una tipo de Actividad con el ID ${id}`});
      return;
    };
    req.types_activitys=typesActivity;
    next();

  } catch (error) {
    console.error('algo salio mal', error);
    res.status(500).json({msg: 'algo salio mal'});
    return;
  };
};

export async function validateTypesActivitysUpdate( req: Request, res: Response, next: NextFunction ): Promise<void> {
  await body('name')
    .notEmpty().withMessage('El nombre del tipo de la activida es requerido')
    .isLength({min: 3}).withMessage('El nombre de la Categoria es muy Corto, minimo 3 caracteres')
    .run(req)
  await body('category')
    .notEmpty().withMessage('La categoria de la actividad es requerida Ej: "cardio","fuerza","flexibilidad" ')
    .isIn(['cardio','fuerza','flexibilidad']).withMessage('La categoria no es valida Ej: "cardio","fuerza","flexibilidad" ')
    .run(req)
  next();
};

export async function query_typesActivitys( req: Request, res: Response, next: NextFunction ): Promise<void> {
  await query('category')
    .optional()
    .custom(value => typeof value === 'string').withMessage('La Categoria no es valida debe de ser un String')
    .isIn(['cardio','fuerza','flexibilidad']).withMessage('La categoria no es valida Ej: "cardio","fuerza","flexibilidad" ')
    .run(req)
  await query('limit')
    .optional()
    .isInt({ min: 1 }).withMessage('La cantidad no es valida')
    .run(req)
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.status(400).json({msg: error.array()});
    return;
  }  
  next();
};

export async function validateUserTypesActivitys( req: Request, res: Response, next: NextFunction ): Promise<void> {
  if (!req.user) {
    res.status(401).json({msg: 'No Autenticado'});
    return;
  };

  if (req.types_activitys.userId !== req.user.id) {
    res.status(409).json({msg: 'No estas Autorizado para realizar esta accion'});
    return;
  }

  next()

};