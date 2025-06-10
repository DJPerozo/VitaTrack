import { json, type Request, type Response } from 'express';
import sequelize from '../config/db';
import Project from '../models/Projects';
import Task from '../models/Tasks';
import { FindAndCountOptions } from 'sequelize';


class TasksControllers{
  static create = async ( req: Request, res: Response ): Promise<void> => {
    const transaction = await sequelize.transaction();
    const { title, description, projectId } = req.body;
    try {
      const project = await Project.findByPk(projectId, { transaction });
      if (!project) {
        await transaction.rollback();
        res.status(404).json({msg: 'El Proyecto no Existe'});
        return;
      };

      if (req.user.id !== project.userId) {
        await transaction.rollback();
        res.status(409).json({msg: 'Este Proyecto pertenece a otro Usuario no estas Autorizado para agregar tareas a este Proyecto'});
        return;
      };

      const tasks = new Task();
      tasks.title=title;
      tasks.description=description;
      tasks.projectId=project.id;
      tasks.userId=req.user.id;

      await tasks.save( {transaction} );

      await transaction.commit();
      res.status(201).json({msg: 'Exito Tarea agrada con exito'});
      return;

    } catch (error) {
      await transaction.rollback();
      console.error('algo salio mal',error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };

  };

  static getAll = async ( req: Request, res: Response ): Promise<void> => {
    const { project_id, limit } = req.query as {
      project_id?: number,
      limit?: number
    };

    try {
      const options: FindAndCountOptions<Task> = {
        where: { userId: req.user.id },
        include: [{
          model: Project,
          attributes: ['id' ,'name', 'estado']
        }],
        order: [
          ['id', 'DESC']
        ],
        limit: limit || 10
      };

      if (project_id) {
        options.where = {
          projectId: project_id,
          userId: req.user.id
        }
      };

      const tasks = await Task.findAndCountAll(options);
      res.status(200).json({Tareas: tasks.rows, Total: tasks.count});
    } catch (error) {
      console.error('algo salio mal',error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };
  };

  static getById = async ( req: Request, res: Response ): Promise<void> => {
    try {
      const tasks = await Task.findByPk(req.tasks.id, {
        include: [{
          model: Project,
          attributes: ['id', 'name', 'description', 'estado']
        }]
      });
      res.status(200).json({msg: 'Exito', tasks});
      return;
    } catch (error) {
      console.error('algo salio mal',error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };
  };

  static update = async ( req: Request, res: Response ): Promise<void> => {
    const { title, description, completed } = req.body;
    try {
      const newTasks = await req.tasks.update({title, description,  completed});
      res.status(200).json({msg: 'Exito Proyecto actualizado', newTasks});
      return;

    } catch (error) {
      console.error('algo salio mal',error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };
    
  };

  static delete = async ( req: Request, res: Response ): Promise<void> => {
    try {
      await req.tasks.destroy();
      res.status(200).json({msg: 'Exito Tarea Eliminada con Exito'});
      return;
    } catch (error) {
      console.error('algo salio mal',error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };
  };


};

export default TasksControllers;