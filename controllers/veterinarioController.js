import Veterinario from '../models/Veterinario.js';
import generarJWT from '../helpers/generarJWT.js';
import generarId from '../helpers/generarId.js';
import emailRegistro from '../helpers/emailRegistro.js';
import emailOlvidePassword from '../helpers/emailOlvidePassword.js';

//Registrar
const registrar = async (req, res) => {
    //cambiamos el tipo send por jason, y para esto añadimo llaves y en vez de send utilizamos json para responder del lado del servidor.   

    //Prevenir usuario duplicados
    const { email, nombre } = req.body;//extraemos los datos de req.body lo1que el usuario llena o envia
    const existeUusuario = await Veterinario.findOne({ email: email });

    if (existeUusuario) {

        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message });
    }

    //Insertar datos de  Nuevo veterinario
    const veterinario = new Veterinario(req.body);
    const veterinarioGuardado = await veterinario.save();// con .save() indicasmo a mongoose que guardamos el registra

    //Enviar Email
    //llamamos a la funcion email resgitros deomde le pasamos un objeto con los datos
    emailRegistro({
        email: email,
        nombre: nombre,
        token: veterinarioGuardado.token
    });

    res.json(veterinarioGuardado);

    try {

    } catch (error) {
        console.log(error);

    }

}


//confirmar usuario
const confirmar = async (req, res) => {
    //req.params recuperamos el valor de la url 
    //console.log(req.params.token);//psamos el  parametro que hemos definido en las veterinario.Routes
    const { token } = req.params;

    const usuarioConfirmar = await Veterinario.findOne({ token: token });

    if (!usuarioConfirmar) {
        const error = new Error('Token no valido');
        return res.status(404).json({ msg: error.message })

    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save(); //confirmamos la transaccion

        res.json({ msg: 'Usuario Confirmado Correctamente' });
    } catch (error) {

        console.log(error);


    }


}

//autenticar usuario
const autenticar = async (req, res) => {

    const { email, password } = req.body;

    //comprobar si el usuario existe
    const usuario = await Veterinario.findOne({ email: email });//buscamos por el correo del usuario, si existe


    if (!usuario) {
        const error = new Error('el usuario no Existe');
        return res.status(404).json({ msg: error.message });

    }

    //comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message });
    }

    //Revisar el password
    if (await usuario.comprobarPassword(password)) {//llamamos al methodo que hemos definido en nuestro schema en /models/Veterinario.js y le pasamo el password del formulario
        // console.log("password correcto");
        //Autenticar
        //devolvemos los datos en forma de objeto
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            telefono: usuario.telefono,
            web : usuario.web,
            token: generarJWT(usuario.id),

        });
        //res.json({token:generarJWT(usuario.id)});



    } else {
        const error = new Error('El password es incorrecto');
        return res.status(403).json({ msg: error.message });
    }

}

//pefil muestra el perfil de usuario
const perfil = (req, res) => {
    const { veterinario: veterinario } = req;
    res.json({ veterinario }); //psamos la sesion de veterinaio que habiamos almacenado en req y se la psamos a un objeto veterinario para poder visualizarlo
}


//Olvide Password
const olvidePassword = async (req, res) => {
    const { email } = req.body;
    console.log(email);
    //console.log(email);//comcprobamos que  se comunique bien con nuestro end point
    const existeVeterinario = await Veterinario.findOne({ email: email }); //buscamos por el email en las bases de datos

    if (!existeVeterinario) {
        const error = new Error('El usuario no existe');

        return res.status(400).json({ msg: error.message });

    }


    try {
        existeVeterinario.token = generarId();//llammamos a la funcion generarid donde generamos un id unico para guerdarlo en la bases de datos
        await existeVeterinario.save();//guardamos el id en la bases de datos

        //Evniar el emial con instrucciones, creamos una funcion
        emailOlvidePassword({
            email: email,
            nombre: existeVeterinario.nombre,//recuperamos el nombre que nos devuelve el servidor si existe el ususario
            token: existeVeterinario.token
        });

        res.json({ msg: "Hemos enviado un email con la instrucciones" });


    } catch (error) {
        console.log(error);


    }

}


const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const tokenValido = await Veterinario.findOne({ token: token });

    if (tokenValido) {

        //El token válido el usuario existe
        res.json({ msg: "Token Valido el usuario Existe" })

    } else {
        const error = new Error('Token no valido');
        res.status(400).json({ msg: error.message })
    }

}

const nuevoPassword = async (req, res) => {

    const { token } = req.params;//params parametros de la url
    const { password } = req.body; //body lo qu escribe el usuario

    const veterinario = await Veterinario.findOne({ token: token }); //buscamos por el token que se ha generado en las partes anteriores del codigo


    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });

    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({ msg: "Password Modificado Correctamente...." })


    } catch (error) {
        console.log(error);

    }

};

//Actualizar Perfil
const actualizarPerfil = async (req, res) => {
    //console.log(req.params.id);//obtenemos el id
    //console.log(req.body);//obtenemos todos los datos de body

    const veterinario = await Veterinario.findById(req.params.id);//obtemos de la bases de datos el id

    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    //Comprobamos, si el usuario esta realizando la modidficacion del email ya que este es unico en la bases de datos y no se puede repetir
    const {email}= req.body;
    

    if (veterinario.email !== req.body.email) {//si el mail es distinto
     
        //los buscamos en bases de datos si existe
        const  existeEmail = await Veterinario.findOne({email:email});
        
        //si esxite mostramos error, porque el email esta utilizado y debe ser unico
        if(existeEmail){

            const error = new Error('Ese Email ya esta en uso');
            return res.status(400).json({msg: error.message});

        }
    }

    try {
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);//mostramos los datos actaulizados

    } catch (error) {

        console.log(error)

    }

}

const actualizarPassword=async(req,res)=>{

    //leer los datos

    //console.log(req.veterinario);
    //console.log(req.body);

    const {id}= req.veterinario;//extraemos el id

    const {pwd_actual, pwd_nuevo}= req.body;// extraemos los passwords 



    //comprobar que el veterinario exista
    const veterinario = await Veterinario.findById(id);//obtemos de la bases de datos el id

    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    //comprobar su password
 if(await veterinario.comprobarPassword(pwd_actual)){//utiizamos el metodo que habiamos definido en nuestro modelo  para comprobar el password
     //Almacenar el nuevo password si es correcto
     veterinario.password = pwd_nuevo;// antes de guardarse en la bases de datos se va a hashear desde nuestro modelo
     await veterinario.save();
     res.json({msg:'Password Almacenado Correctamente', error:false});

 }else{
    const error = new Error('El Password Actual es Incorrecto');
        return res.status(400).json({ msg: error.message });
 }
   

}

//Exportamos
export { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword }