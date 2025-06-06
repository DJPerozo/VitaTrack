import type { Request, Response } from 'express';
import User from '../models/User';
import { comparePassword, hashPassword } from '../helpers/Bcrypt-auth';
import { generateToken } from '../helpers/token-auth';
import sequelize from '../config/db';
import { generateJWT } from '../helpers/jwt-auth';
import { AuthEmail } from '../email/AuthEmail';
import { token } from 'morgan';

class AuthControllers{
  static create_account = async ( req: Request, res: Response ): Promise<void> => {
    const transaction = await sequelize.transaction();
    const { name, email, password } = req.body;
    try {
      const userExis = await User.findOne({
        where: {email}, transaction
      });
      if (userExis) {
        await transaction.rollback()
        res.status(409).json({msg: 'Ya existe un Usuario Registrado con ese Email'});
        return;
      };

      const user = new User();
      user.name=name;
      user.email=email;
      user.password=await hashPassword(password);
      user.token=generateToken();

      await user.save({transaction});

      await transaction.commit();

      AuthEmail.AuthEmailConfirmation ({
        name: user.name,
        email: user.email,
        token: user.token
      })


      res.status(201).json({msg: 'Exito su cuenta ya esta casi lista revise su email y inserte el codigo para confirmar cuenta'});
      return;

     
    } catch (error) {
      await transaction.rollback()
      console.error('algo salio mal',error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    }
  };

  static confirm_account = async ( req: Request, res: Response ): Promise<void> => {
    const { token } = req.body;
    try {
      const user = await User.findOne({
        where: { token }
      });
      if (!user) {
        res.status(403).json({msg: 'Token no valido'});
        return;
      };

      user.confirm=true;
      user.token=null;

      await user.save();
      res.status(200).json({msg: 'Exito cuenta confirmada'});
      return;

    } catch (error) {
      console.error('algo salio mal',error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    }
  };

  static login = async ( req: Request, res: Response ): Promise<void> => {
    const transaction = await sequelize.transaction();
    const { email, password } = req.body;
    try {
      const user = await User.findOne({
        where: {email}, transaction
      });
      if (!user) {
        await transaction.rollback();
        res.status(401).json({msg: 'No Autenticado'});
        return;
      };

      if (!user.confirm) {
        await transaction.rollback();
        res.status(403).json({msg: 'La cuenta no a sido confirmada'});
        return;
      };

      const passwordExis = await comparePassword(password, user.password);
      if (!passwordExis) {
        await transaction.rollback();
        res.status(401).json({msg: 'No autenticado'});
        return;
      };

      await transaction.commit();
      const token = generateJWT(user.id);
      res.status(200).json({msg: 'Exito usuario autenticado', token});
      return;


    } catch (error) {
      await transaction.rollback();
      console.error('algo salio mal',error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    }
  };

  static forgot_password = async ( req: Request, res: Response ): Promise<void> => {
    const { email } = req.body;
    try {
      const user = await User.findOne({
        where: {email}
      });
      if (!user) {
        res.status(403).json({msg: 'No estas Autorizado'});
        return;
      };

      user.token=generateToken();
      await user.save();

      AuthEmail.AuthEmailForgotPassword({
        name: user.name,
        email: user.email,
        token: user.token
      })

      res.status(200).json({msg: 'Exito revisa tu Email para mas intrucciones'});
      return;

    } catch (error) {
      console.error('algo salio mal',error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    }
  };

  static validate_token = async ( req: Request, res: Response ): Promise<void> => {
    const { token } = req.body;
    try {
      const user = await User.findOne({
        where: {token}
      });
      if (!user) {
        res.status(403).json({msg: 'Token no valido'});
        return;
      };
      res.status(200).json({msg: 'Exito token valido'});
      return;
    } catch (error) {
      console.error('algo salio mal',error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    }
  };

  static reset_password = async ( req: Request, res: Response ): Promise<void> => {
    const token = req.params.token;
    const { password } = req.body;
    try {
      const user = await User.findOne({
        where: {token}
      });
      if (!user) {
        res.status(403).json({msg: 'Token no valido'});
        return;
      };
      user.password=await hashPassword(password);
      user.token=null;
      await user.save();

      res.status(200).json({msg: 'Exito Password modificado con exito'});
      return;

    } catch (error) {
      console.error('algo salio mal',error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };

  };

  static user = async ( req: Request, res: Response ): Promise<void> => {
    try {
      res.status(200).json(req.user);
      return;
    } catch (error) {
      console.error('algo salio mal',error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    }
  };


  static update_password = async ( req: Request, res: Response ): Promise<void> => {
    const { current_password, newpassword } = req.body;
    const { id } = req.user;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        res.status(401).json({msg: 'No Autorizado'});
        return;
      };

      const passwordExis = await comparePassword(current_password, user.password);
      if (!passwordExis) {
        res.status(401).json({msg: 'No Autenticado'});
        return;
      };

      user.password=await hashPassword(newpassword);
      await user.save();
      res.status(200).json({msg: 'Exito Password actualizado'});
      return; 

    } catch (error) {
      console.error('algo salio mal',error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };

  };

};  

export default AuthControllers;