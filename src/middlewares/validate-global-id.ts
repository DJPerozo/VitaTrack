import type { Request, Response, NextFunction } from 'express';
import { param, body, validationResult } from 'express-validator';


export async function validateGlobalId( req: Request, res: Response, next: NextFunction ): Promise<void> {
  await param('id')
    .isInt().withMessage('ID no valido')
    .custom(value => value > 0).withMessage('ID no valido')
    .run(req)
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.status(400).json({msg: error.array()});
    return;
  };
  
  next();
  
};

