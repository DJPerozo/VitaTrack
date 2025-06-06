import type { Request, Response } from 'express';
import TypesActivity from '../models/TypesActivity';
import SportsActivity from '../models/SportsActivities';
import { FindAndCountOptions } from 'sequelize';

class TypesActivitysControllers{
  static getAll = async ( req: Request, res: Response ): Promise<void>  => {
    const { category, limit } = req.query;
    const limitt = limit ? limit : 10;
    try {
      const options: any = {
        where: { userId: req.user.id },
        order: [
          ['id', 'DESC']
        ],
        include: [{
          model: SportsActivity,
          attributes: ['id', 'duration', 'intensity', 'userId']
        }],
        limit : limitt

      }
      if (category) {
        options.where.category=category
      }
      const typesActivity = await TypesActivity.findAndCountAll(options);
      res.status(200).json({ TiposActividades: typesActivity.rows, total: typesActivity.count });
    } catch (error) {
      console.error('algo salio mal', error);
      res.status(500).json({msg: 'algo salio mal'});
      return;  
    };

  };

  static getById = async ( req: Request, res: Response ): Promise<void>  => {
    try {
      const typesActivity = await TypesActivity.findByPk(req.types_activitys.id, {
        include: [{
          model: SportsActivity,
          attributes: ['id', 'duration', 'intensity', 'userId']
        }],
      });
      res.status(200).json({msg: 'Exito', typesActivity});
      return;
    } catch (error) {
      console.error('algo salio mal', error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };
  };

  static update = async ( req: Request, res: Response ): Promise<void>  => {
    const {name, category} = req.body;
    try {
      const newTypeactivity = await req.types_activitys.update({name, category});
      res.status(200).json({msg: 'Exito', newTypeactivity});
      return;
    } catch (error) {
      console.error('algo salio mal', error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };
  };

  static delete = async ( req: Request, res: Response ): Promise<void>  => {
    try {
      await req.types_activitys.destroy();
      res.status(200).json({msg: 'Exito el tipo de actividad se elimino coreectamente'});
      return;
    } catch (error) {
      console.error('algo salio mal', error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };
  };

  
};

export default TypesActivitysControllers;

