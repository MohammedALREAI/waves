import { CreateWoodDto } from './../dtos/createWood.dto';
import { LoginUserDto } from '../dtos/users.dto';
import  adminMiddleware  from '@middlewares/auth.middleware';
import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import formidable from 'express-formidable'
class UsersRoute implements Routes {
  public path = '/api/product/wood';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    

    /**
     * this  should be  loagin  and  admin 
     * 
     */
    this.router.post(`${this.path}/`, validationMiddleware(CreateWoodDto, 'body'), this.usersController.createUser);

    this.router.post(`${this.path}/login`, validationMiddleware(LoginUserDto, 'body'), this.usersController.logIn);

    this.router.get(`${this.path}/auth`, authMiddleware,this.usersController.authUser);

    this.router.get(`${this.path}/logout`, authMiddleware,this.usersController.logOut);


    this.router.get(`${this.path}`, authMiddleware,adminMiddleware,this.usersController.getUsers);
    this.router.get(`${this.path}/:id`, authMiddleware,adminMiddleware,this.usersController.getUserById);

    this.router.post(`${this.path}/uploadimage`, authMiddleware,adminMiddleware,formidable(),this.usersController.uploadimage);
    this.router.post(`${this.path}/removeimage`, authMiddleware,adminMiddleware,this.usersController.removeimage);
    this.router.post(`${this.path}/addToCart`, authMiddleware,this.usersController.addToCart);
    this.router.post(`${this.path}/removeFromCart`, authMiddleware,this.usersController.removeFromCart);
    this.router.post(`${this.path}/successBuy`, authMiddleware,this.usersController.successBuy);
    this.router.post(`${this.path}/update_profile`, authMiddleware,this.usersController.updateUser);








    
    
    this.router.post(`${this.path}/reset_user`, this.usersController.logIn);


    this.router.put(`${this.path}/:id`, validationMiddleware(CreateUserDto, 'body', true), this.usersController.updateUser);
    this.router.delete(`${this.path}/:id`, this.usersController.deleteUser);
  }
}

export default UsersRoute;
