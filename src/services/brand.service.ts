import { HttpException } from '@exceptions/HttpException'
import { Brand } from '@interfaces/Brands.interface'
import { isEmpty } from '@utils/util'

import brandModel from '@/models/brand.model'
import { CreateBrandDto, UpdateBrandDto } from '@/dtos/createBrand.dto'



/**
 * @class BrandService 
 */

class BrandService {
  public Brand = brandModel;

  /**
   * 
   * @returns 
   */

  public async Brands(): Promise<Brand[]> {
    
    const Brand: Brand[] = await this.Brand.find();
    return Brand;
  }

  /**
   * 
   * @param BrandId 
   * @returns 
   */
  public async findBrandById(BrandId: string): Promise<Brand> {
    if (isEmpty(BrandId)) throw new HttpException(400, "You're not userId");

    const findUser: Brand = await this.Brand.findOne({ _id: BrandId });
    if (!findUser) throw new HttpException(409, "You're not BrandId");

    return findUser;
  }

  /**
   * 
   * @param BrandData 
   * @returns 
   */

  public async createBrand(BrandData: CreateBrandDto): Promise<Brand> {
    if (isEmpty(BrandData)) throw new HttpException(400, "You're not userData");
        const{name}=BrandData
    const findBrand: Brand = await this.Brand.findOne({ name});
    if (findBrand) throw new HttpException(409, `You're email ${BrandData.name} already exists`);

    const createBrandData: Brand = await (await this.Brand.create({name})).save();

    return createBrandData;
  }
  /**
   * 
   * @param BrandId 
   * @param BrandData 
   * @returns 
   */

  public async updateBrand(BrandId: string, BrandData: UpdateBrandDto): Promise<Brand> {
    if (isEmpty(BrandId) ||isEmpty(BrandData)) throw new HttpException(400, "You're not userData");
    const{name}=BrandData

    if (!name) throw new HttpException(409, `You're email ${name} already exists`);

      const Brandfound: Brand = await this.Brand.findOne({ name});
      if (!Brandfound) throw new HttpException(409, `You're email ${name} already exists`);
    
        const updateBrandById = await this.Brand.findByIdAndUpdate({id:BrandId}, { name });
        if (!updateBrandById) throw new HttpException(409, "You're not user");
        return updateBrandById;
    }

    /**
     * 
     * @param BrandId 
     * @returns 
     */
  public async deleteBrand(BrandId: string): Promise<Brand> {
    if (isEmpty(BrandId)) throw new HttpException(400, "You're not BrandId");

    const deleteBrandById: Brand = await this.Brand.findByIdAndDelete(BrandId);
    if (!deleteBrandById) throw new HttpException(409, "You're not user");

    return deleteBrandById;
  }
}

export default BrandService;
