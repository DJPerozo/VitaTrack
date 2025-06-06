import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function generateJWT(id: number) {
  const token = JWT.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'});
  return token;
};