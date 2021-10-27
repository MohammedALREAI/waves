import { UpdateWoodDto } from './../dtos/createWood.dto';
import { logger } from '@/utils/logger';
import { uploadImage } from '@utils/util';
import { RequestWithUser } from '../interfaces/auth.interface';
import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/user.interface';
import  cloudinary  from 'cloudinary'
import userModel from '@/models/users.model';
import {  Types } from 'mongoose';
import ProductModel from '@/models/Product.model';
import paymentModel from '@/models/payment.model';
import WoodService from '@/services/wood.service';
import { Wood } from '@/interfaces/Wood.interface';

class UsersController {
  public readonly woodService = new WoodService();
  private readonly logger = logger;

  /**
   * 
   * @param req 
   * @param res 
   * @param next 
   */

  public createWood = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const createWood=await  this.woodService.createWood(req.body)
      if(!createWood){
        res.status(404).json({ wood: null,success:false, message: 'there  is  some  error in create  data ' });

      }
      res.status(200).json({ wood: createWood, success: true, });

      
    } catch (error) {
      logger.error(`there  is  some   SOME error tho handlw  with  the  server  `);
      next(error);
    }
  };


  public woods = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const  woods  =await  this.woodService.woods();
      if(!woods){
        res.status(404).json({ wood: [], message: 'there  is  no  item  like  this  woods ' });
      }
      res.status(200).json({ wood: woods, success: true, });

    } catch (error) {
      this.logger.error(`there  is  some   SOME error tho handlw  with  the  server  `);
      next(error);
    }
  };






  public removeWood = async(req: RequestWithUser, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    try {
     const isRemove= await  this.woodService.deleteWood(id)
 
    if(!isRemove){
      res.status(404).json({success:false,message:`filed  to  remove  this  wood  item  with  your  id ${id}`})
    }
     res.status(200).json({
      success:true})
  } catch (error) {
    logger.error(`there  is  some  data PUSH  item ${error}`)
    next(error);


  }
  }



  public getWoodById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const woodId: string = req.params.id;
      const myWood: Wood = await this.woodService.findWoodById(woodId);
    if(!myWood){
      res.status(404).json({data:null,message:`filed  to  remove  this  wood  item  with  your  id ${woodId}`})


    }
      res.status(200).json({ data: myWood, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public updateWood = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateWood: UpdateWoodDto = req.body.updateWood;
      const  woodId=req.params.woodId;
      const woodUpdate: Wood = await this.woodService.updateWood(woodId,updateWood);
      if(!woodUpdate){
        res.status(404).json({ data: null, message: 'there  is  something  happend  to  create  user  so  please look  agin  woodUpdate' });
      }
      res.status(201).json({ data: woodUpdate, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}




export  default UsersController;