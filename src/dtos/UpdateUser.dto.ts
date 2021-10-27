import { IsEmail, IsOptional, IsString } from 'class-validator'

export class UpdateUser {
  @IsString()
  @IsOptional()
  public name?: string;

  @IsEmail()
  @IsOptional()
  public email?: string;
  
}




