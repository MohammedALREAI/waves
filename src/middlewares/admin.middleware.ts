import { NextFunction, Response } from 'express'
import { HttpException } from '@exceptions/HttpException'

import { RequestWithUser } from './../interfaces/auth.interface'

const adminMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (req.user.role === 0) {
    next(new HttpException(401, 'Wrong authentication token'));
      return res.status(402).json('you are not allowed, get out now.')
  }
  next();
}

export default  adminMiddleware ;

