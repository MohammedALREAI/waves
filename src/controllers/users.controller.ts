import { logger } from '@/utils/logger';
import { uploadImage } from '@utils/util';
import { RequestWithUser } from './../interfaces/auth.interface';
import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/user.interface';
import UserService from '@services/users.service';
import  cloudinary  from 'cloudinary'
import userModel from '@/models/users.model';
import {  Types } from 'mongoose';
import ProductModel from '@/models/Product.model';
import paymentModel from '@/models/payment.model';

class UsersController {
  public userService = new UserService();


  /**
   * 
   * @param req 
   * @param res 
   * @param next 
   */

  public getUsers = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser();
      if(!findAllUsersData){
        res.status(404).json({ data: null, message: 'there  is  no data  found  like that' });
      }
      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };


  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const { cookie, findUser } = await this.userService.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: findUser, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public uploadimage = async(req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const  path =((req.files) as any).file.path
      const  result=await uploadImage(path);

       res.status(200).send({
          public_id: result.public_id,
          url: result.url
      })
    } catch (error) {
      logger.error(`there  is  some  data`);
      next(error);

      
    }
  };


  public removeimage = async(req: RequestWithUser, res: Response, next: NextFunction) => {
      const image_id = (req.query.public_id) as string  ;
      try {
        const  result=await cloudinary.v2.uploader.destroy(image_id);
        res.status(200).send('ok');

      } catch (error) {
        logger.error(`there  is  some  data remove  item ${image_id}`)
        next(error);


      }
    
  }

  public addToCart = async(req: RequestWithUser, res: Response, next: NextFunction) => {
    const  isFoundUser:User =await  this.userService.findUserById(req.user._id);
    let duplicate = false;
    isFoundUser.cart.forEach((item)=>{
      if(item.id == req.query.productId){
        duplicate=true;
      }
    })
    const productId=Types.ObjectId((req.query.productId)as string)
if(duplicate){
  try {
    const  updatedUser =await  userModel.findByIdAndUpdate(
      {_id: req.user._id, "cart.id":productId},
      { $inc: { "cart.$.quantity":1 } },
      { new:true } )
      if(!updatedUser){
        res.status(404).json({success:false});
    }
    res.status(200).json(updatedUser.cart)
    
  } catch (error) {
    logger.error(`there  is  some  data remove  item ${error}`)
    next(error);

  }

}
else{
  try {
    
    const  updatedUserwitPush =await  userModel.findByIdAndUpdate(
      {_id: req.user._id},
      { $push:{ cart:{
          id:productId,
          quantity:1,
          date: Date.now()
      } }},
      { new: true });
      if(!updatedUserwitPush){
        res.status(404).json({success:false});
    }
    else{
      res.status(200).json(updatedUserwitPush.cart)
  
    }
  } catch (error) {
    next(error);

    logger.error(`there  is  some  data PUSH  item ${error}`)

  }
  
}

  }


  public removeFromCart = async(req: RequestWithUser, res: Response, next: NextFunction) => {
    const cart_ID=Types.ObjectId((req.query._id)as string);
    const user_id =req.user._id

    try {
      const  cart_user = await  userModel.findOneAndUpdate(
       {_id: user_id },
       { "$pull":
           { "cart": {"id":cart_ID} }
       },
       { new: true });
       
        if(!cart_user){
          res.status(404).json({success:false});
        }

  const cart = cart_user.cart;
  const array:Types.ObjectId[] = cart.map(item=>{
    return Types.ObjectId(item.id)});
  try {
    if(array.length){
      res.status(404).json({
        success:"there is no  item  like  that"    })

    }
    const  cartDetail = await ProductModel.find({"_id":{$in:array}}).
    populate("brand").populate("wood");
    if(!cartDetail){
      res.status(404).json({success:false});
  
    }
     res.status(200).json({
      cartDetail,
      cart
  })
  } catch (error) {
    logger.error(`there  is  some  data PUSH  item ${error}`)
    next(error);


  }
  
  }
 catch (error) {
  logger.error(`there  is  some  data PUSH  item ${error}`)
  next(error);

  }

  }



  
  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: string = req.user._id;
      const logOutUserData: User = await this.userService.logoutUser(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const findOneUserData: User = await this.userService.findUserById(userId);
    if(!findOneUserData){
      res.status(404).json({ data: null, message: 'there  no  item  like  that ' });

    }

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const createUserData: User = await this.userService.createUser(userData);
      if(!createUserData){
        res.status(404).json({ data: null, message: 'there  is  something  happend  to  create  user  so  please look  agin ' });
      }
      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData: CreateUserDto = req.body;
      const updateUserData: User = await this.userService.updateUser(userId, userData);
      if(!updateUserData){
        res.status(404).json({ data: null, message: 'there  is  something  updateUser  to  create  user  so  please look  agin ' });


      }

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const deleteUserData = await this.userService.deleteUser(userId);
      if(!deleteUserData){
        res.status(404).json({ data: null, message: 'there  is  something  updateUser  to  create  user  so  please look  agin ' });
      }

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
  public authUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user: User = req.user;
      res.status(200).json({
        isAdmin: user.role === 0 ? false : true,
        isAuth: true,
        email:user.email,
        name: user.name,
        lastname:user.lastname,
        role:user.role,
        cart:user.cart,
        history: user.history
      }
        );   
  };
  public successBuy = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const history = [];


   type TtransactionData={
    user:{
      [key: string]: any
    },
    data:any,
    product:any
   }
    const transactionData:TtransactionData= {
      user: {},
      data: undefined,
      product: undefined
    }
    // cartDetail as Array
    // user history
    req.body.cartDetail.forEach((item)=>{
        history.push({
            dateOfPurchase: Date.now(),
            name: item.name,
            brand: item.brand.name,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: req.body.paymentData.paymentID
        })
    })

    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        lastname: req.user.lastname,
        email: req.user.email
    }
    transactionData.data = req.body.paymentData;
    transactionData.product = history;
    try {
      const  user = await userModel.findOneAndUpdate(
         { _id: req.user._id },
         { $push:{ history:history }, $set:{ cart:[] } },
         { new: true })
         if(!user){
           res.status(404).json({success:false});
         }
         try {
           const savedPayment = await (new paymentModel(transactionData).save());
            if(!savedPayment){
              res.json({success:false});
            }
     
            const products = [];
            savedPayment.product.forEach(item=>{
                products.push({id:item.id,quantity:item.quantity})
             }) 
             try {
               const  data= await Promise.all(
                products.map(async element => {
                  await ProductModel.updateMany(
                    {_id:element.id},
                    { $inc:{
                        "sold": element.quantity
                    }},
                    {new:false})
                })
              )
               
              if(!data){
                 res.json({success:false})
              }
              res.status(200).json({
                success:true,
                cart: user.cart,
                cartDetail:[]
            })
             } catch (error) {
               logger.error(`there is  some  error updateMany ${error}`)
               next(error);
             }    

         } catch (error) {

          logger.error(`there is  some  error updateMany ${error}`)
          next(error);

         }

      
    } catch (error) {
      logger.error(`there is  some  error updateMany ${error}`)

      next(error);

      
    }
        }}




export  default UsersController;