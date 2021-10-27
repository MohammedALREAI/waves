import { logger } from '@/utils/logger';

import { ISendEmail } from '@/interfaces/sendEmail.interface';
import  mailer from 'nodemailer'
import { resetPass } from './resetpass_template';
import { welcome } from './welcome_template';
// require('dotenv').config();


interface IgetEmailData{
    to:string,
    name:string,
    token?:string,
    template:"welcome"|"purchase"|"reset_password"
    actionData:any

}


const getEmailData = ({to,name,token,template,actionData}:IgetEmailData) =>{
    let data = null;

    switch(template){
        case "welcome":
            data = {
                from: "Waves <waves.guitars.rev@gmail.com>",
                to,
                subject: `Welcome to waves ${name}`,
                html: welcome()
            }
        break;
        case "purchase":
            data = {
                from: "Waves <waves.guitars.rev@gmail.com>",
                to,
                subject: `Thanks for shopping with us ${name}`,
                html: purchase(actionData)
            }
        break;
        case "reset_password":
            data = {
                from: "Waves <waves.guitars.rev@gmail.com>",
                to,
                subject: `Hey ${name}, reset your pass`,
                html: resetPass(actionData)
            }
        break;
        default:
            data;
    }
    return data;
}






export const sendEmail = ({to,name,token,template,actionData = null}:ISendEmail) => {
    const smtpTransport = mailer.createTransport({
        service:"Gmail",
        auth:{
            user: process.env.EMAIL_PASS,
            pass: process.env.EMAIL_PASS
        }
    });




    const mail = getEmailData({to,name,token,template,actionData})

    smtpTransport.sendMail(mail,function(error,response){
        if(error){
logger.error(`there  are  some  error  to  handle  with sendMail ${error}`)
        } else {
            // logger.s(`it  was  success  to  send  the  mail  for  user sendMail ${response.message}`)

            console.log("Message sent: " + response.message);
        }
        smtpTransport.close();
    })
}

