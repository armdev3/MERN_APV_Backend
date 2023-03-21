import express from "express";
//definimos nuestra variable router para realizar configuraciones
//importamos nuestros constrollers
import { 

registrar, 
perfil,
confirmar,
autenticar,
olvidePassword,
comprobarToken,
nuevoPassword,
actualizarPerfil,
actualizarPassword

} from '../controllers/veterinarioController.js';

import checkAuth from "../middleware/middlewareAuth.js";



const router = express.Router();

//Enrutamos a la pagina de inicio de veterinarios

//Rutas publicas
router.post('/',registrar);//inicio
router.get('/confirmar/:token', confirmar);//confirmar, con los dos puntos indicamos a express que vamos a pasar parametro
router.post('/login/', autenticar);
router.post('/olvide-password/', olvidePassword);
// router.get('/olvide-password/:token', comprobarToken);
// router.post('/olvide-password/:token', nuevoPassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);//otra forma de realizar las dos lineas antreiores con un get y post con la misma url.

//Area Privada
router.get('/perfil',checkAuth,perfil);//colocamos el chackAuht parea comprobar el perfil del usuario
//Actualizar perfil, pasamo el perfil y el id
router.put('/perfil/:id',checkAuth, actualizarPerfil);
router.put('/actualizar-password/',checkAuth, actualizarPassword);


export default router;