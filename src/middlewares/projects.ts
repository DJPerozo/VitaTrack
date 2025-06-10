import type { Request, Response, NextFunction } from 'express';
import { param, body, validationResult, query } from 'express-validator';
import Project from '../models/Projects';
import e from 'express';
import { min } from 'date-fns';


declare global{
  namespace Express{
    interface Request{
      project?: Project
    }
  }
}

export async function validateProjectExis( req: Request, res: Response, next: NextFunction ): Promise<void> {
const id = req.params.id;
  try {
    const project = await Project.findByPk(id);
    if (!project) {
      res.status(404).json({msg: `No se encontro un proyecto con el ID ${id} `});
      return;
    };
    req.project=project;
    next();
  } catch (error) {
    console.error('algo salio mal',error);
    res.status(500).json({msg: 'algo salio mal'});
    return;
  };
  
};

export async function validateProjectInput( req: Request, res: Response, next: NextFunction ): Promise<void> {
  await body('name')
    .notEmpty().withMessage('El nombre no puede ir vacio')
    .run(req)
  await body('description')
    .notEmpty().withMessage('La descripcion no puede ir vacia')
    .isLength({min: 8}).withMessage('La descripcion es muy corta, minimo 8 caracteres')
    .run(req)
  next();  
};

export async function validateProjectUpdate( req: Request, res: Response, next: NextFunction ): Promise<void> {
  await body('name')
    .notEmpty().withMessage('El nombre no puede ir vacio')
    .isString().withMessage('El nombre debe de ser una cadena de texo valida')
    .run(req)
  await body('description')
    .notEmpty().withMessage('La descripcion no puede ir vacia')
    .isString().withMessage('La dexcripcion debe ser una cadena de texto valida')
    .isLength({min: 8}).withMessage('La descripcion es muy corta, minimo 8 caracteres')
    .run(req)
  await body('estado')
    .notEmpty().withMessage('El estado de ir "pendiente", "En_progreso", "Completado')
    .isString().withMessage('El estado debe de ser texto valido')
    .isIn(['Planificado', 'En_progreso', 'Completado']).withMessage("El estado del proyecto es Incorrecto valores: 'Planificado', 'En_progreso', 'Completado'")
    .custom(value => typeof value === 'string').withMessage('El estado debe de ser un String')
    .run(req)  
  next();  
};


export async function UserProject( req: Request, res: Response, next: NextFunction ): Promise<void> {
  if(!req.user){
    res.status(401).json({msg: 'No estas autenticado'});
    return;
  };

  if (req.project.userId !== req.user.id) {
    res.status(409).json({msg: 'Este Projecto pernece a otro Usuario, no estas Autorizado para realizar esta accion'});
    return;
  };
  next()

};

export async function query_projects( req: Request, res: Response, next: NextFunction ): Promise<void> {
  await query('limit')
    .optional()
    .default(10)
    .isInt({min: 1, max: 30}).withMessage('La cantidad debe de ser un numero valido entero entre 1 y 30')
    .run(req);
  await query('estado')
    .optional()
    .isIn(['Planificado', 'En_progreso', 'Completado']).withMessage(" estado incorrecto valores: 'Planificado', 'En_progreso', 'Completado' ")
    .isString().withMessage('El estado debe de ser una cadena de texto Valida')
    .custom(value => typeof value === 'string').withMessage('El estado debe de ser una cadena de texto Valida, "Planificado", "En_progreso", "Completado" ')
    .run(req)  
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.status(400).json({msg: error.array()});
    return;
  };
  next();
    
};





