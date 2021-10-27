
export interface IFilterOptions{
    limit?:number,
    order?:string |any,
    sortBy?:string |any,
    skip?:number,
    filters:{
        [key:string]:any
    }
    }