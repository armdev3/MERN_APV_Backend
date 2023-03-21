import mongoose from "mongoose"; 
//console.log('desde aqui',process.env.MONGO_URI);

const conectarDB = async()=>{
    //a parit de la version 6 en adelante de mongoose, tenemos que deshabilitar o habilitart los mensajes de error
    //https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options
   
    mongoose.set('strictQuery', true);//realizamos un set para elmimar los warnings
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);

        //Esto nos devuelve una url y el puerto donde se esta conectando de mongo db
        const url =`${db.connection.host}:${db.connection.port}`;

        console.log(`MongoDB conectado en ${url}`);
        
    } catch (error) {
        console.log(`error: ${error.message}`);
        process.exit(1);
    }

}



export default conectarDB;