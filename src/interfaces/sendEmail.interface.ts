
export  interface  ISendEmail{
    to:string,
    name:string,
    token?:string,
    template:"welcome"|"purchase"|"reset_password",
    actionData:any 

}