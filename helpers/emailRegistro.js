//importamos el nodemailer
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const url_frontend = process.env.FRONTEND_URL

const emailRegistro = async (datos)=>{
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    //console.log(datos);

    //obtenemos los datos del objeto que hemos recibido de la funcion, para poder enviar el email
    const { email, nombre, token } = datos;

    //enviamos el email
    const info = await transporter.sendMail({
        from: "APV - Administrador de PAcientes de Veterinaria",
        to: email,
        subject: 'Comprueba tu cuenta en APV',
        text:'Comprueba tu cuenta en APV',
        html:`<p>Hola:${nombre}, comprueba tue cuenta eb APV.</p>
         <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
         <a href="${url_frontend}/confirmar/${token}">Comprobar cuenta</a></p>
         <p>Si tu no creaste esta cuenta, puedes omitir este mensaje</p>
        `


    });

    console.log("MEnsaje enviado: %s", info.messageId);//gardamos la informacion en id
}

export default emailRegistro;