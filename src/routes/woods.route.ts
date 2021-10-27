import { CreateWoodDto, UpdateWoodDto } from './../dtos/createWood.dto';
import  adminMiddleware  from '@middlewares/auth.middleware';
import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import WoodController from '@/controllers/woods.controller';
import { IdParams } from '@/dtos/ID_Parms';
class WoodRoute implements Routes {
  public path = '/api/product/wood';
  public router = Router();
  public woodsController = new WoodController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    

    /**
     * this  should be  loagin  and  admin 
     * 
     */


    /**'
     *  @Route  for   post  
     *  
     */


    this.router.post(`${this.path}/`,  authMiddleware,adminMiddleware ,validationMiddleware(CreateWoodDto, 'body'), this.woodsController.createWood);


    this.router.get(`${this.path}/:id`, authMiddleware,adminMiddleware,validationMiddleware(IdParams, 'params'),this.woodsController.getWoodById);


    this.router.get(`${this.path}/woods`,authMiddleware, adminMiddleware ,this.woodsController.woods);


    this.router.delete(`${this.path}/:id`,  authMiddleware,adminMiddleware,validationMiddleware(IdParams, 'params'),this.woodsController.removeWood);
    this.router.put(`${this.path}/:id`,  authMiddleware,adminMiddleware,validationMiddleware(IdParams, 'params'),validationMiddleware(UpdateWoodDto, 'body'),this.woodsController.removeWood);


  }
}

export default WoodRoute;
