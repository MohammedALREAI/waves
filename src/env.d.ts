export interface IProcessEnv {
  PORT: number;
}

declare global {
  namespace NodeJS {
    export interface IProcessEnv {
      PORT: number;
      secretKey:string,
      Mail_user:string
      Mail_pass:string,
      CLOUD_NAME:string,
      CLOUD_API_KEY:string,
      CLOUD_API_SECRET:string,
    }  
  }
}
