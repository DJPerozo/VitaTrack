import { type Request, type Response, type NextFunction, json } from 'express';
import { param, body, validationResult, query } from 'express-validator';
import Task from '../models/Tasks';

declare global{
  namespace Express{
    interface Request{
      tasks?:Task
    }
  }
}

export async function validateTasksExis( req: Request, res: Response, next: NextFunction ): Promise<void> {
  const id = req.params.id;
  try {
    const tasks = await Task.findByPk(id);
    if (!tasks) {
      res.status(404).json({msg: `No se encontro una Tarea con el ID ${id}`});
      return;
    };
    req.tasks=tasks
    next();
  } catch (error) {
    console.error('algo salio mal',error);
    res.status(500).json({msg: 'algo salio mal'});
    return;
  }; 
};

export async function validateTasksInput( req: Request, res: Response, next: NextFunction ): Promise<void> {
  await body('title')
    .notEmpty().withMessage('El titulo de la tarea no puede ir vacio')
    .custom(value => typeof value === 'string').withMessage('El titulo de la tarea debe de ser String')
    .run(req)
  await body('description')
    .notEmpty().withMessage('La descripcion de la tarea es requerida')
    .isLength({min: 5}).withMessage('La descripcion de la tarea es muy corta, minimo 5 caracteres')
    .run(req)
  await body('projectId')
    .notEmpty().withMessage('El ID del proyecto es Requerido')
    .custom(value => typeof value === 'number').withMessage('El ID del proyecto no es valido')
    .isInt({min: 1}).withMessage('El ID del proyecto no es valido')
    .run(req)
  next()      
};

export async function validateTasksUpdate( req: Request, res: Response, next: NextFunction ): Promise<void> {
  await body('title')
    .notEmpty().withMessage('El titulo de la tarea no puede ir vacio')
    .isString().withMessage('El titulo debe de ser una cadena de texto valida')
    .isLength({min: 1}).withMessage('El titulo debe de contener al menos un caracter de longitud')
    .run(req)
  await body('description')
    .notEmpty().withMessage('La descripcion de la tarea es requerida')
    .isString().withMessage('La descripcion debe de ser una cadena de Texo valida')
    .isLength({min: 5, max: 250}).withMessage('La descripcion debe de una cadena de texo valida entre 5 y 250 caracteres')
    .run(req)
  await body('completed')
    .isBoolean().withMessage('el estado no es valido debe de ser true o false')
    .isIn([false, true]).withMessage('El estado de completado no es valido valores: "true" o "false"')
    .run(req)  
  next()   
};

export async function query_tasks( req: Request, res: Response, next: NextFunction ): Promise<void> {
  await query('project_id')
    .optional()
    .isInt({min: 1}).withMessage('El ID del proyecto no es valido')
    .run(req)
  await query('limit')
    .optional()
    .default(10)
    .isInt({min: 1, max: 30}).withMessage('La cantidad debe de ser un numero entero valido de 1 a 30')
    .run(req)  
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.status(400).json({msg: error.array()});
    return;
  };
  next();  
};

export async function userTasksVerify( req: Request, res: Response, next: NextFunction ): Promise<void> {
  if (!req.user) {
    res.status(401).json({msg: 'No Autenticado'});
    return;
  };

  if (req.tasks.userId !== req.user.id) {
    res.status(409).json({msg: 'Esta tarea pertenece a otro Usuario no estas Autorizado para Realizar esta accion'});
    return;
  };
  next();
  
};