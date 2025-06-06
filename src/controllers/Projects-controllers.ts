import type { Request, Response } from "express";
import Project from "../models/Projects";
import Task from "../models/Tasks";


class ProjectsControllers{
  static create = async ( req: Request, res: Response ): Promise<void> => {
    const { name, description } = req.body;
    try {
      const project = new Project();
      project.name=name;
      project.description=description;
      project.userId=req.user.id;
      await project.save();
      res.status(201).json({msg: 'Exito Proyecto creado',project});
      return;
    } catch (error) {
      console.error('algo salio mal',error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };
  };

  static getAll = async ( req: Request, res: Response ): Promise<void> => {
    const { limit, estado } = req.query;
    const limitt = limit ? limit : 10;
    const estados = estado ? estado : null;
    try {
      const option: any = {
        where:{userId: req.user.id},
        include: [{
          model: Task,
          attributes: ['id', 'title', 'description', 'completed']
        }],
        limit: limitt
      };
      if (estado) {
        option.where.estado=estados 
      };

      const projects = await Project.findAndCountAll(option);
      res.status(200).json({Proyectos: projects.rows, Total: projects.count});
      return;
    } catch (error) {
      console.error('algo salio mal',error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };

  };

  static getById = async ( req: Request, res: Response ): Promise<void> => {
    const project = await Project.findByPk(req.project.id,{
      include: [{
        model: Task,
        attributes: ['id', 'title', 'description', 'completed']
      }]
    });
    res.status(200).json({msg: 'Exito', project});
    return;
  };

  static update = async ( req: Request, res: Response ): Promise<void> => {
    const { name, description, estado } = req.body;
    try {
      const project = await req.project.update({name, description, estado});
      res.status(200).json({msg: 'Exito', project});
      return;
    } catch (error) {
      console.error('algo salio mal',error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };

  };

  static delete = async ( req: Request, res: Response ): Promise<void> => {
    try {
      await req.project.destroy();
      res.status(200).json({msg: 'Exiito Proyecto eliminado'});
      return
    } catch (error) {
      console.error('algo salio mal',error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };
  };

};

export default ProjectsControllers;