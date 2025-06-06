import { transport } from "../config/nodemailer";
import colors from 'colors'
interface userEmail {
    name: string,
    email: string,
    token: string
}

export class AuthEmail {
    static AuthEmailConfirmation = async (user: userEmail) => {
        const email = await transport.sendMail({
            from: 'VitaTrack',
            to: user.email,
            subject: 'VitaTrack Confirma tu Cuenta',
            html: `
                <p> Hola ${user.name} has Creado tu cuenta en VitaTrack, ya esta casi lista </p> 
                <p> visita el siguiente enlace</p> 
                <a href= "#">confirmar cuenta</a>
                <p> ingresa el codigo:<b>${user.token}</b> </p> 

            `
        })
        console.log(colors.cyan.bold('email enviado'), email.messageId)
    };

    static AuthEmailForgotPassword = async (user: userEmail) => {
        const email = await transport.sendMail({
            from: 'VitaTrack',
            to: user.email,
            subject: 'VitaTrack Reestableser Password',
            html: `
                <p> Hola ${user.name} as solicitado Reestableser tu password</p> 
                <p> visita el siguiente enlace</p> 
                <a href= "#">Reestableser Password</a>
                <p> ingresa el codigo:<b>${user.token}</b> </p> 

            `
        })
        console.log(colors.cyan.bold('email enviado'), email.messageId)
    };


};