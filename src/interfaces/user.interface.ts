import { Document } from 'mongoose'

export interface User extends Document {
  email: string,
  password: string,
  name: string,
  lastname: string,
  cart?: Array<any>
  history?: Array<any>
  role?: number
  token?: string,
  resetToken?: string,
  resetTokenExp?: number,
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateResetToken():Promise<string>;
  generateToken():Promise<string>;
  findByToken(token:string): Promise<User>;


}





