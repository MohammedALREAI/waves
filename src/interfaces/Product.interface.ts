import { Document } from 'mongoose'

import { Brand } from './Brands.interface'
import { Wood } from './Wood.interface'

export interface Product extends Document {
  name:string,
  description:string,
  price:number,
  shipping:boolean,
  available:boolean,
  brand:Brand['_id'],
  wood:Wood['_id'],
  frets:number,
  sold:number,
  publish:boolean,
  images:Array<any>

}
