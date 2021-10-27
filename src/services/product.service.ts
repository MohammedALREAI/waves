import { ICrateArticle } from './../interfaces/crateArticle.interface';
import { logger } from '@/utils/logger';
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcrypt'
import { HttpException } from '@exceptions/HttpException'
import { isEmpty } from '@utils/util'

import ProductModel from '@/models/Product.model'
import { Product } from '@/interfaces/Product.interface'

import { IFilterOptions } from './../interfaces/FilterOptions'
import { IGetArticlesByIDS } from '@/interfaces/getArticlesBy.interface';
import { Types } from 'mongoose';
import { isBoolean, isNumber } from 'class-validator';

class ProductService{
  public product = ProductModel;

  public async findAllUser(): Promise<Product[]> {
    const product: Product[] = await this.product.find();
    return product;
  }

  public async findUserById(productId: string): Promise<Product> {
    if (isEmpty(productId)) throw new HttpException(400, "You're not productId");

    const product: Product = await this.product.findOne({ _id: productId });
    if (!product) throw new HttpException(409, "You're not Product");

    return product;
  }

  
/**
 * 
 * @param options 
 * @returns 
 */
  
  public async addShop(options:IFilterOptions): Promise<Product[]> {
      
        let{order,sortBy,limit,skip,filters}=options
     order = order ? order : "desc";
     sortBy =sortBy ? sortBy : "_id";
     limit = limit ?limit: 100;
     skip = skip? skip:0;
    const findArgs = {};
    ///  will   be  move  throw  all  the  data  
    if(!filters) throw new HttpException(201, "You're not filters");
 for(const key in filters){
        if(filters[key].length >0 ){
            if(key === 'price'){
                findArgs[key] = {
                    $gte:filters[key][0],
                    $lte:filters[key][1]
                }
            }else{
                findArgs[key] =filters[key]
            }
        }
    }
    try {
      const product =await this.product.find(findArgs).populate('brand').
      populate('wood').
      sort([[sortBy,order]]).
      skip(skip).
      limit(limit);
      if(!product){
       throw new HttpException(201, "You're not filters");
 
      }
 
     return product;
      
    } catch (error) {
      logger.error(`there  is  some  error  to handle  with  data ${error}`)
      
    }
  }
  public async getArticles(options:IFilterOptions): Promise<Product[]> {
      
        let{order,sortBy,limit}=options
     order = order ? order : "desc";
     sortBy =sortBy ? sortBy : "_id";
     limit = limit ?limit: 100;

    try {
      const product =await this.product.find().populate('brand').
      populate('wood').
      sort([[sortBy,order]]).
      limit(limit);
      if(!product){
       throw new HttpException(201, "You're not filters");
 
      }
 
     return product;
      
    } catch (error) {
      logger.error(`there  is  some  error  to handle  with  data ${error}`)
      
    }
  }




  public async getArticlesByIDS(options:IGetArticlesByIDS): Promise<Product[]> {      
    let{idS,type}=options
    if (isEmpty(idS)) throw new HttpException(400, "You're not id must  be  found");
    if (isEmpty(type)) throw new HttpException(400, "You're not type");

    const listId = idS.split(',');
    let items:Array<string> = [];
     items = listId.map(item=>{
         return String(Types.ObjectId(item))
     })
 
try {
  const product = await this.product.
  find({ '_id':{$in:items}}).
  populate('brand').
  populate('wood')
  if(!product){
   throw new HttpException(201, "You're not filters");

  }

 return product;
  
} catch (error) {
  logger.error(`there  is  some  error  to handle  with  data ${error}`)
  
}
}

/**
 * 
 * @param options 
 * @returns 
 */

public async crateArticle(options:ICrateArticle): Promise<Product> {      
  let{brand,available,description,frets,images,name,price,publish,sold,shipping,wood}=options;



  if (isEmpty(brand as  string)) throw new HttpException(400, "You're not id must  be  brand");
  if (isBoolean(available)) throw new HttpException(400, "You're not id must  be  available");

  if (isEmpty(description)) throw new HttpException(400, "You're not must  be  description");
  if (isNumber(frets)) throw new HttpException(400, "You're not id must  be  frets");
  if (isEmpty(name)) throw new HttpException(400, "You're not id must  be  name");

 

try {
const crateProduct = this.product.create(options)
const  product=(await crateProduct).save();
if(!product){
 throw new HttpException(201, "You're not filters");

}

return product;

} catch (error) {
logger.error(`there  is  some  error  to handle  with  data ${error}`)

}
}

}

export default ProductService;