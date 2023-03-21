//importamos el nodemailer
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const url_frontend = process.env.FRONTEND_URL;

const emailOlvidePassword = async (datos)=>{
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
        subject: 'Reestablece tu password',
        text:'Reestablece tu password',
        html:`<p>Hola:${nombre}, has solitiado reestablecer tu password.</p>

         <p>Sigue el siguiente enlace para generar un nuevo password:
         <a href="${url_frontend}/olvide-password/${token}">Reestablecer Password</a></p>
         <p>Si tu no creaste esta cuenta, puedes omitir este mensaje</p>
        `


    });

    console.log("Mensaje enviado: %s", info.messageId);//guardamos la informacion en id
}

export default emailOlvidePassword;