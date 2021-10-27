import { Document } from 'mongoose'

export interface Payment extends Document {
  user:Array<any>
data:Array<any>,
product:Array<any>
}
