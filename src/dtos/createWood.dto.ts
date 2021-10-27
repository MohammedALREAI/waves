import { IsOptional, IsString } from 'class-validator'

export class CreateWoodDto {
  @IsString()
  public name: string;
}




export class UpdateWoodDto  {
  @IsOptional()
  @IsString()
  public name?: string;
}


