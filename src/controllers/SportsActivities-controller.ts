import type { Request, Response } from "express";
import sequelize from "../config/db";
import SportsActivity from "../models/SportsActivities";
import TypesActivity from "../models/TypesActivity";
import { FindAndCountOptions } from "sequelize";

class SportsActivities{
  static create = async ( req: Request, res: Response ): Promise<void> => {
    const transaction = await sequelize.transaction();
    const { duration, intensity, typesActivity } = req.body;
      try {
        const sportsActivities = await SportsActivity.create({
          duration: duration,
          intensity: intensity,
          userId: req.user.id
        }, {transaction} );

        for(const item of typesActivity) {
          const typesActivity = await TypesActivity.create({
            name: item.name,
            category: item.category,
            sportsActivityId: sportsActivities.id,
            userId: req.user.id
          }, {transaction} );
        };
        await transaction.commit();
        res.status(201).json({msg: 'Exito la Actividad se agrego con exito'});
        return;

      } catch (error) {
        await transaction.rollback();
        console.error('algo salio mal al crear una nueva Actividad', error);
        res.status(500).json({msg: 'algo salio mal'});
        return;
      };
  };

  static getAll = async ( req: Request, res: Response ): Promise<void> => {
    const { intensidad, limit } = req.query;
    const limitt = limit ? limit : 10;
    try {
      const options: any = {
        where: {
          userId: req.user.id
        },
        order: [
          ['id', 'DESC']
        ],
        include: [{
          model: TypesActivity,
          attributes: ['id', 'name', 'category', 'userId']
        }],
        limit: limitt
      };

      if (intensidad) {
        options.where.intensity=intensidad
      
      };

      const activities = await SportsActivity.findAndCountAll(options);
      res.status(200).json({Actividades: activities.rows, Total: activities.count});
      return; 
    } catch (error) {
      console.error('algo salio mal', error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };

  };

  static getById = async ( req: Request, res: Response ): Promise<void> => {
    try {
      const sportsActivities = await SportsActivity.findByPk(req.sports_activities.id, {
        include: [{
          model: TypesActivity,
          attributes: ['id', 'name', 'category', 'userId']
        }]
      });
      res.status(200).json({msg: 'Exito', sportsActivities});
      return;
    } catch (error) {
      console.error('algo salio mal', error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };

  };

  static update = async ( req: Request, res: Response ): Promise<void> => {
    const { duration, intensity } = req.body;
    try {
      const newActiviry = await req.sports_activities.update({duration, intensity});
      res.status(200).json({msg: 'Exito Actividad Actualizada', newActiviry});
      return;
    } catch (error) {
      console.error('algo salio mal', error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };

  };

  static delete = async ( req: Request, res: Response ): Promise<void> => {
    try {
      await req.sports_activities.destroy();
      res.status(200).json({msg: 'La Actividad deportiva se elimino Correctamente'});
      return;
    } catch (error) {
      console.error('algo salio mal', error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };

  };

};

export default SportsActivities;