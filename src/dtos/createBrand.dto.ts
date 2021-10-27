import { IsOptional, IsString } from 'class-validator'

export class CreateBrandDto {
  @IsString()
  public name: string;
}
export class UpdateBrandDto  {
    @IsOptional()
    @IsString()
    public name?: string;
  }
  