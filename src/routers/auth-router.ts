import express from 'express';
import AuthControllers from '../controllers/Auth-controllers';
import { body, param } from 'express-validator';
import { handleInputError } from '../middlewares/validation-global';
import { verifyJWT } from '../middlewares/verify-jwt';

const authRouter = express.Router();

authRouter.post('/create-account', 
  body('name')
    .notEmpty().withMessage('El nombre es Requerido')
    .isString().withMessage('El nombre debe de ser en String'),
  body('email')
    .notEmpty().withMessage('El Email es Requerido')
    .isEmail().withMessage('Email no valido'),
  body('password')
    .notEmpty().withMessage('El Password no puede estar vacio')
    .isLength({min: 8}).withMessage('El password es muy corto, minimo 8 Caracteres'),
  handleInputError,  
  AuthControllers.create_account

);

authRouter.post('/confirm-account', 
  body('token')
    .notEmpty().withMessage('El token es requerido')
    .isLength({min: 6, max: 6}).withMessage('token no valido'),
  handleInputError,  
  AuthControllers.confirm_account

);

authRouter.post('/login', 
  body('email')
    .notEmpty().withMessage('El Email es requerido')
    .isEmail().withMessage('Email no valido'),
  body('password')
    .notEmpty().withMessage('El password no puede ir vacio'),
  handleInputError,  
  AuthControllers.login

);

authRouter.post('/forgot-password', 
  body('email')
    .notEmpty().withMessage('Email requerido')
    .isEmail().withMessage('Email no valido'),
  handleInputError,  
  AuthControllers.forgot_password

);

authRouter.post('/validate-token', 
  body('token')
    .notEmpty().withMessage('El token es requerido')
    .isLength({min: 6, max: 6}).withMessage('token no valido'),
  handleInputError,  
  AuthControllers.validate_token

);

authRouter.post('/reset-password/:token', 
  param('token')
    .notEmpty().withMessage('El token es requerido')
    .isLength({min: 6, max: 6}).withMessage('token no valido'),
  body('password')
    .notEmpty().withMessage('El nuevo password es requerido')
    .isLength({min: 8}).withMessage('El nuevo Password es muy corto, monimo 8 Caracteres'),
  handleInputError,
  AuthControllers.reset_password
);

authRouter.get('/user', 
  verifyJWT,
  AuthControllers.user
);

authRouter.post('/update-password', 
  verifyJWT,
  body('current_password')
    .notEmpty().withMessage('El Password actual es Requerido'),
  body('newpassword')
    .notEmpty().withMessage('El nuevo Password es Requerido')
    .isLength({min: 8}).withMessage('El nuevo Password es muy corto, minimo 8 caracteres'),
  handleInputError,
  AuthControllers.update_password

)


export default authRouter;