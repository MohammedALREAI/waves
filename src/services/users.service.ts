import { UpdateUser } from './../dtos/UpdateUser.dto';
import { CreateUserDto } from '@dtos/users.dto'
import { HttpException } from '@exceptions/HttpException'
import { User } from '@interfaces/user.interface'
import { isEmpty, uploadImage } from '@utils/util'
import userModel from '@/models/users.model'
import { isNumber } from 'class-validator'
/**
 * @class UserService 
 */



class UserService {
  public users = userModel;





  public async findAllUser(): Promise<User[]> {
    const users: User[] = await this.users.find();
    return users;
  }

  public async findUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const findUser: User = await this.users.findOne({ _id: userId });
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }


  public async createUser(userData: CreateUserDto): Promise<User> {

    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const createUserData: User = await this.users.create(userData);

    return createUserData;
  }



  
  public async login(userData: CreateUserDto): Promise<{ cookie: string; findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (!findUser) throw new HttpException(409, `You're email ${userData.email} not found`);



    const isPasswordMatching: boolean = await findUser.comparePassword(userData.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const tokenData =   await findUser.generateToken();
    const cookie = await  this.createCookie(tokenData) ;

    return { cookie, findUser };
  }
  public async createCookie(tokenData: string):Promise<string>{
return  " "  }



/**
 * 
 * @param role 
 * @returns 
 */
  
public async changeRole(role: number): Promise<{confirm:string }> {
  if (isNumber(role) || role!==1) throw new HttpException(400, "You're not userData");


  const findUser: User = await this.users.findOne({role});
  if(!findUser){
    throw new HttpException(400, "You're not userData");
  }
  findUser.role=1;
  const  isSuccess=await findUser.save();
  if(!isSuccess){
    throw new HttpException(401, "You're not  access to  these section ");
  }
  
  return {
    confirm:"your  are   sucees  to  change  your  role  to  admin "
  }
}

/**
 * 
 * @param userId 
 * @param userData 
 * @returns 
 */


  public async updateUser(userId: string, userData: UpdateUser): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    if (userData.email) {
      const findUser: User = await this.users.findOne({ email: userData.email });
      if (findUser && findUser._id != userId) throw new HttpException(409, `You're email ${userData.email} already exists`);
    }

    const updateUserById: User = await this.users.findByIdAndUpdate(userId, {"$set":userData },{
      new:true
    });
    if (!updateUserById) throw new HttpException(409, "You're not user");

    return updateUserById;
  }


  /**
   * 
   * @param userId 
   * @returns 
   */

  public async deleteUser(userId: string): Promise<{message:string}> {
    const deleteUserById: User = await this.users.findByIdAndDelete(userId);
    if (!deleteUserById) throw new HttpException(409, "You're not user");

    return {
      message:"success to  remove  the user"
    };
  }
  public async uploadimage(path: string): Promise<{message:string}> {
    const   imageName=await uploadImage(path)


    return {
      message:"success to  remove  the user"
    };
  }
  public async removeimage(userId: string): Promise<{message:string}> {
   
    return {
      message:"success to  remove  the user"
    };
  }



  public async logoutUser(userId: string): Promise<User> {
    const userById: User = await this.users.findById(userId);
    if(!userById) throw new HttpException(409, "You're not user");
    userById.token='';
    userById.resetToken='';
    userById.resetTokenExp=0;
      const logoutUser=await userById.save();
      if(!logoutUser){
        throw new HttpException(409, "You're not user");
      }



    return logoutUser;
  }
}

export default UserService;
