import type { Request, Response } from 'express';
import Learning from '../models/Learning';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';
import { FindAndCountOptions, Op } from 'sequelize';

class LearningControllers{
  static creata = async ( req: Request, res: Response ): Promise<void> => {
    const { issue, content, resources, grades  } = req.body;
    try {
      const newLearning = await Learning.create({
        issue: issue,
        content: content,
        resources: resources,
        grades: grades,
        userId: req.user.id
      });
      res.status(201).json({msg: 'exito nuevo aprendinsaje se agrego con exito', newLearning});
      return;
    } catch (error) {
      console.error('lago salio mal',error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    }
  };

  // implemente mejoras en el tipado de las query tipado mas estripto con typescript en todos los rutas de mi aplicacion....Tambien ise unas mejoras en las validacion de entrada de datos.
  static getAll = async ( req: Request, res: Response ): Promise<void> => {
    const { fecha } = req.query as {
      fecha?: string
    }
    try {
      const option: FindAndCountOptions<Learning> = {
        where: {userId: req.user.id}
      };

      if (fecha) {
        const date = parseISO(fecha);
        if (!isValid(date)) {
          res.status(400).json({msg: 'La fecha no es validad'});
          return;
        };

        const star = startOfDay(date);
        const end = endOfDay(date);

        option.where = {
          createdAt:{ 
            [Op.between] : [star, end]
          },
          userId: req.user.id
        }
        
      };

      const learning = await Learning.findAndCountAll(option);
      res.status(200).json({MiAprendizaje: learning.rows, Total: learning.count});
      return;
    } catch (error) {
      console.error('lago salio mal',error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };

  };

  static getById = async ( req: Request, res: Response ): Promise<void> => {
    try {
      const learning = await Learning.findByPk(req.learning.id);
      res.status(200).json({msg: 'Exito', learning});
      return; 
    } catch (error) {
      console.error('lago salio mal',error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    }
  };

  static update = async ( req: Request, res: Response ): Promise<void> => {
    const { issue, content, resources, grades  }  = req.body;
    try {
      const learning = await req.learning.update({
        issue: issue,
        content: content,
        resources: resources,
        grades: grades,
      });
      res.status(200).json({msg: 'Exito Aprendizaje Actualizado', learning});
      return;
    } catch (error) {
      console.error('lago salio mal',error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };

  };

  static delete = async ( req: Request, res: Response ): Promise<void> => {
    try {
      await req.learning.destroy();
      res.status(200).json({msg: 'El tema de Aprendizaje se Elimino con Exito'});
      return;
    } catch (error) {
      console.error('lago salio mal',error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };

  };

};

export default LearningControllers;
