//forma antigua de llamar a express: cont express = requiere('express')
//nueva forma, tenemod que indicar en el fichero package.json despues de version, añadir "type":"module"
import express from "express";
import dotenv from 'dotenv';//dependencia para poder añadir variables de entorno
import cors from 'cors';  //importamos los cors para no tener problemas de comunicacion con el frontend
import conectarDB from "./config/db.js";//conexion a las bases de datos
import veterinarioRoutes from "./routes/veterinarioRoutes.js";//simpre los ficheros que hayamos creado nosotros a la hora de importarlos deben llevra la extensión
import pacienteRoutes from "./routes/pacienteRoutes.js";

const app = express();
//usamos express.json para indicar al servidor que vamos a enviar datos de tipo jsona postman
app.use(express.json());

dotenv.config();//tenemos que colocarla antes de la conexion a las bases de datos y posteriomente pueda ser leida la variable de entorno
conectarDB();

//psamos el enlace de nuestra variable de entorno
const dominiosPermitidos = [process.env.FRONTEND_URL];
//console.log(dominiosPermitidos);
const corsOptions = {
    origin: function (origin, callback) {
        if (dominiosPermitidos.indexOf(origin) !== -1) {//si url esta en el origen de permitidos y si es difrente de -1 quiere decir que si lo encontro
            //el origen del request esta permitido
            callback(null, true)//null serie el error, en caso de que hubiera, si no lo ponemos a null para no mostrar nada

        } else {

            callback(new Error('No permitido por Cors'))

        }
    }
}
//indicamos a express que queremos usar cors
app.use(cors(corsOptions));

//realizamos la conexión con el servidor localhost:4000 e iremos indicando la rutas de nuetras paginas web
//veterinariosRoutes hace referencia a la variable router, es como si pusieramos router.get('/',(req,res)=>{res.send('Estas en la pagina')}); directamente
//localhost:4000/api/veterinarios
app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);


const PORT = process.env.PORT || 4000

//ñadimos comprobamos el puerto a la escucha
app.listen(PORT, () => {
    console.log(`servidor funcionando en el puerto ${PORT}`);
});