import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import generarId from '../helpers/generarId.js';

//definimos nuestro schema
const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarId(),

    },
    confirmado: {
        type: Boolean,
        default: false
    }

});

//midldeware de moongose com pre
veterinarioSchema.pre('save', async function (next) {//usamos function porque hace referencia al objeto actual parar poode usar el this, con arrow no se puede porque hace refernecia a la ventana globa y no podemos haser uso del this
    //console.log(this);//obtenemos la instancia antes de almacenar los datos en la bases de datos.

    if (!this.isModified("password")) {//valiadacion de mongo, si tenemos un password ya hasheado o midificado , este no se volvera a hasehar e ira a la siguiente linea
        next();//va al sigiente middleware
    }

    const salt = await bcrypt.genSalt(10);//rondas de hasheo=> Si es mas alto, mas lento vuelve nuestro servidor al realizarlo

    this.password = await bcrypt.hash(this.password, salt); //hecemos la refernecia del password  actual con el hasheo y lo alamcenamos en la variable password
});


//Registramos un metodo en nuestro schema, podemos ponerle cualquier nombre
veterinarioSchema.methods.comprobarPassword = async function (passwordFormulario) {

    return await bcrypt.compare(passwordFormulario, this.password)//compare toma dos parametros  el data y el encripted;

}


//ahora registramos nuestro schema en mongoose indicamos nuestro model y psamos nuestro schema
const Veterinario = mongoose.model("Veterinario", veterinarioSchema);

export default Veterinario;