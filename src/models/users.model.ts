import * as Jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import config from 'config'
import crypto from 'crypto'
import { model, Model, Schema } from 'mongoose'

import { logger } from '@/utils/logger'

import { User } from './../interfaces/user.interface'

const SECRET:string=config.get('secretKey') || process.env.secretKey ;

import moment from'moment'
const SALT_I = 10;
const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: 1
},
password: {
    type: String,
    required: true,
    minlength: 5
},
name: {
    type: String,
    required: true,
    maxlength: 100
},
lastname: {
    type: String,
    required: true,
    maxlength: 100
},
cart: {
    type: Array,
    default: []
},
history: {
    type: Array,
    default: []
},
role: {
    type: Number,
    default: 0
},
token: {
    type: String
},
resetToken: {
    type: String
},
resetTokenExp: {
    type: Number
},
});


/***
 * 
 *  handle  wit user  pefiore  save  it 
 * 
 * 
 * 
 */

userSchema.pre("save",async function (next) {
  const user = this  as User;
  if (user.isModified('password')) {
    try {
        const hashPassword = await bcrypt.hash(user.password,SALT_I)  as string
        if (!hashPassword) {
            throw new Error('there some Error to enchrapt password please  try  agine')
        }
        user.password = hashPassword  as  string;
        next();

    } catch (err) {
      logger.error(`there  is  some  issue  i conform  password ${err}`)
      return next(err);
    }

  
  }else{
    next()
  }
  
});




/**
 * 
 * comparePassword
 * @param candidatePassword 
 * @param cb 
 */

//  userSchema.methods.comparePassword =  async function (candidatePassword):Promise<boolean> {
//   const user = this  as User;

//     const  isMatch = await  bcrypt.compare(candidatePassword, user.password);
//       if (isMatch) return true;
//       return  false
// }


userSchema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
  const user = this  as User;
  return new Promise((resolve, reject) => {
      bcrypt.compare(candidatePassword, user.password, (err, success) => {
          if (err) return reject(err);
          return resolve(success);
      });
  });
};

/**
 * 
 * @param cb 
 */

 userSchema.methods.generateResetToken =  async function () {
  const user = this  as User;
const  buffer=await  crypto.randomBytes(20);
        if(!buffer){
        return ''
          }
      const token = buffer.toString('hex');
      const today  = String((moment().startOf('day')).valueOf())
      const tomorrow =  Number((moment().endOf('day')).valueOf())

      user.resetToken = token;
      user.resetTokenExp = tomorrow;
      const  savesdUser=await  user.save();
      if(!savesdUser) {return} 

            return  token;


}

/**
 * generateToken
 * 
 * @param cb 
 */


 userSchema.statics.findByToken = function (token, cb) {
  const user = this as unknown as Model<User> ;
  
  Jwt.verify(token,SECRET, function (err, decode) {
    user.findOne({ "_id": decode, "token": token }, function (err, user) {
          if (err) return cb(err);
          cb(null, user);
      })
  })
}

userSchema.methods.generateToken =  async  function (){
  const user = this  as User
  const token = Jwt.sign(((user._id) as any).toHexString(),SECRET) as string  

  user.token = token;
  const savedUser = await user.save();
  if(!savedUser) {
    return ''
  }
  return  token
 
}


/**
 * 
 * @param token 
 * @param cb 
 */


 const userModel = model<User>('User', userSchema);


export default userModel;
