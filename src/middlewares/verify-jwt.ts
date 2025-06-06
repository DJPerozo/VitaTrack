import type { Request, Response, NextFunction } from "express";
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from "../models/User";
dotenv.config();

declare global{
    namespace Express{
        interface Request{
            user?: User
        }
    }
}

export async function verifyJWT( req: Request, res: Response, next: NextFunction ){
    const bearer = req.headers.authorization;
    if (!bearer) {
        res.status(400).json({msg: 'token requerido'});
        return;
    };

    const [ , token] = bearer.split(' ');
    if (!token) {
        res.status(400).json({msg: 'Token Requerido'});
        return;
    };

    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        if (typeof decoded !== 'object' || !decoded.id) {
            res.status(401).json({msg: 'No Autenticado'});
            return;
        };

        req.user = await User.findOne({
            where: {id: decoded.id},
            attributes: ['id','name', 'email']
        });
        next()    
    } catch (error) {
        res.status(401).json({msg: 'No Autenticado'});
        return;
    };

};