import  express  from "express";
import { agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente }  from '../controllers/controllerPaciente.js';
import checkAuth from "../middleware/middlewareAuth.js";//importamos la validacion dle usuario


//creamos la instancis de Routes
const router = express.Router();

//definimos la rutas
router.post('/',checkAuth, agregarPaciente);//añadismo la autenticacion con el checkauth
router.get('/',checkAuth, obtenerPacientes);

router
    .route('/:id')
    .get(checkAuth,obtenerPaciente)
    .put(checkAuth, actualizarPaciente)
    .delete(checkAuth, eliminarPaciente)




export default router;


