import userModel from '@models/users.model'
import config from 'config'
import jwt from 'jsonwebtoken'
import { NextFunction, Response } from 'express'
import { HttpException } from '@exceptions/HttpException'
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface'

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {

  try {
    const token = req.cookies['Authorization'] || req.header('Authorization').split('Bearer ')[1] || null;

    if (token) {
       const findUser =await userModel.findById(token);
      

      if (findUser) {
        req.user = findUser;
        req.token=token
        next();
      } else {
        
        
        next(new HttpException(401, 'Wrong authentication token'));
        return res.status(401).json({
          isAuth: false,
          error: true
      });
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
