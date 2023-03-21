import mongoose from "mongoose"; 

//Definimos el Schema para Pacientes
const pacientesSchema = mongoose.Schema({
    nombre:{
        type:String,
        required:true,
    },
    propietario:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    fecha:{
        type:Date,
        required:true,
        default: Date.now(),
    },
    sintomas:{
        type:String,
        required:true,
    },
    veterinario:{
        type:mongoose.Schema.Types.ObjectId,//obtenmo el id  referenciado  a la tabla de Veterinario
        ref:"Veterinario"
    },


},{
    timestamps:true, //Esto nos crea la columnas de editado y creado
});


const Paciente = mongoose.model("Paciente",pacientesSchema);//pasamos el nombre  y el schema,para crearl el modelo.

export default Paciente;