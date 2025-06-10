import type { Request, Response, NextFunction } from 'express';
import { body, validationResult, query } from 'express-validator';
import Learning from '../models/Learning';
import { Min } from 'sequelize-typescript';

declare global{
  namespace Express{
    interface Request{
      learning?: Learning
    }
  }
}

export async function validateLearningExis( req: Request, res: Response, next: NextFunction ): Promise<void> {
  const id = req.params.id;
  try {
    const learning = await Learning.findByPk(id);
    if (!learning) {
      res.status(404).json({msg: `no se encontro un tema de aprendizaje con el ID ${id}`});
      return;
    };

    req.learning=learning;
    next();

  } catch (error) {
    console.error('algo salio mal', error);
    res.status(500).json({msg: 'algo salio mal'});
    return;  
  };

};

export async function validateLearningInput( req: Request, res: Response, next: NextFunction ): Promise<void> {
  await body('issue')
    .notEmpty().withMessage('El tema es Requerido')
    .isString().withMessage('El tema debe de ser una cadena de caracteres valida')
    .isLength({min: 2}).withMessage('El nombre del tema es muy corto, minimo 2 caracteres')
    .run(req)
  await body('content')
    .notEmpty().withMessage('El contenido del Aprendisaje es requeriso')
    .isString().withMessage('El contenido debe de ser una cadena de caracteres Valida')
    .isLength({min: 5}).withMessage('El contenido del contenido es muy corto')
    .run(req)
  await body('resources')
    .optional()
    .custom(value => typeof value === 'string').withMessage('Los Recursos deben estar en Formato String')
    .run(req)
  await body('grades')
    .optional()
    .isString().withMessage('Las notas deben de ser una una cadena de texto valida')
    .custom(value => typeof value === 'string').withMessage('Las Notas deben estar en Formato String')
    .run(req) 
  next()   

};

export async function query_learning( req: Request, res: Response, next: NextFunction ): Promise<void> {
  await query('fecha')
    .optional()
    .isString().withMessage('la fecha no es valida')
    .custom(value => typeof value === 'string').withMessage('la Fecha no es valida')
    .run(req)
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.status(400).json({msg: error.array()});
    return;
  };
  next();  
};

export async function verifyUserLearning( req: Request, res: Response, next: NextFunction ): Promise<void> {
  if (!req.user) {
    res.status(401).json({msj: 'No Autenticado'});
    return;
  };

  if (req.learning.userId !== req.user.id) {
    res.status(409).json({msg: 'El tema de este aprendizaje le pertenece a otro Usuario, no estas Autorizado para realizar esta accion'});
    return;
  };

  next();

};