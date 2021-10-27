import { Wood } from '@interfaces/Wood.interface';
import { Brand } from "./Brands.interface";


export interface ICrateArticle{
    name:string,
    description:string,
    price:number,
    shipping:boolean,
    available:boolean,
    brand:Brand['_id'],
    wood:Wood['id'],
    frets:number,
    sold:number,
    publish:boolean,
    images:Array<any>

}