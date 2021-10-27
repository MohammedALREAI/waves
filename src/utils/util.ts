import { HttpException } from '@exceptions/HttpException';
import { NextFunction,Request } from 'express';
import  *  as Experss  from 'express';
import { RequestWithUser } from './../interfaces/auth.interface';
import  cloudinary  from 'cloudinary'
import  multer, { FileFilterCallback } from  'multer'
import  {logger} from './logger'
import  path  from 'path'
/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */

export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};



export  const  uploadImage = async(path:string)=>{
  try {
    const imageUplude=await cloudinary.v2.uploader.upload(path,{
      resource_type:"image"
    });
    return  imageUplude;

  } catch (error) {
    logger.warn(` there  is  some  error  to  handle  with cloudinary  ${error} `)
    
  }
}


type CB= (error: Error | null, destination: string) => void
type CBFileNmae= (error: Error | null, filename: string) => void


function fileFilter(req: Request, file: Express.Multer.File, cb: any){
  const extension = path.extname(file.originalname).toLowerCase();
  const mimetyp = file.mimetype;
const   isvalid :boolean=(extension !== '.jpg'  ||mimetyp !== 'image/png')
  if (isvalid) {
      cb('error message', true);
  }
  cb(null, true);
}



const storage = multer.diskStorage({
  destination: (req:RequestWithUser, file:Express.Multer.File, cb:CB) => {
    cb(null, 'uploads/')
  },
  filename: (req:Request, file:Express.Multer.File, cb:CBFileNmae) => {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
  // fileFilter
});

export const upload = multer({ storage }).single('file')