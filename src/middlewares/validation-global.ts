import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from 'express';

export async function handleInputError( req: Request, res: Response, next: NextFunction ): Promise<void> {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.status(400).json({msg: error.array()});
    return;
  }
  next();
};