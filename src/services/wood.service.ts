import { UpdateWoodDto } from './../dtos/createWood.dto';
import { HttpException } from '@exceptions/HttpException'
import { Wood } from '@interfaces/Wood.interface'
import { isEmpty } from '@utils/util'

import woodModel from '@/models/wood.model'
import { CreateWoodDto } from '@/dtos/createWood.dto'

/**
 * @class WoodService 
 */

class WoodService {
  public wood = woodModel;

  /**
   * 
   * @returns 
   */

  public async woods(): Promise<Wood[]> {
    
    const wood: Wood[] = await this.wood.find();
    return wood;
  }

  /**
   * 
   * @param woodId 
   * @returns 
   */
  public async findWoodById(woodId: string): Promise<Wood> {
    if (isEmpty(woodId)) throw new HttpException(400, "You're not userId");

    const findUser: Wood = await this.wood.findOne({ _id: woodId });
    if (!findUser) throw new HttpException(409, "You're not woodId");

    return findUser;
  }

  /**
   * 
   * @param woodData 
   * @returns 
   */

  public async createWood(woodData: CreateWoodDto): Promise<Wood> {
    if (isEmpty(woodData)) throw new HttpException(400, "You're not userData");
        const{name}=woodData
    const findWood: Wood = await this.wood.findOne({ name});
    if (findWood) throw new HttpException(409, `You're email ${woodData.name} already exists`);

    const createWoodData: Wood = await (await this.wood.create({name})).save();

    return createWoodData;
  }
  /**
   * 
   * @param woodId 
   * @param woodData 
   * @returns 
   */

  public async updateWood(woodId: string, woodData: UpdateWoodDto): Promise<Wood> {
    if (isEmpty(woodId) ||isEmpty(woodData)) throw new HttpException(400, "You're not userData");
    const{name}=woodData

    if (!name) throw new HttpException(409, `You're email ${name} already exists`);

      const woodfound: Wood = await this.wood.findOne({ name});
      if (!woodfound) throw new HttpException(409, `You're email ${name} already exists`);
    
        const updateWoodById = await this.wood.findByIdAndUpdate({id:woodId}, { name });
        if (!updateWoodById) throw new HttpException(409, "You're not user");
        return updateWoodById;
    }

    /**
     * 
     * @param woodId 
     * @returns 
     */
  public async deleteWood(woodId: string): Promise<Wood> {
    if (isEmpty(woodId)) throw new HttpException(400, "You're not woodId");

    const deleteWoodById: Wood = await this.wood.findByIdAndDelete(woodId);
    if (!deleteWoodById) throw new HttpException(409, "You're not user");

    return deleteWoodById;
  }
}

export default WoodService;
