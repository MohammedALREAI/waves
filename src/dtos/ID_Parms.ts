import { IsNumber, IsString } from 'class-validator';



export  class  IdParams{
    @IsString()
    public  readonly id: string | number;
  
}