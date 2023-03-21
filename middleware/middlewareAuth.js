import jwt from 'jsonwebtoken'; // Ha la hora de importarlo podemos poner culquier nombre como un alias
import Veterinario from '../models/Veterinario.js';//importamos el modelo para poder realizar consultas a bases de datos

const checkAuth = async (req, res, next) => {

    let token;

    //console.log(req.headers.authorization); extraemos el token de req.headers
    //comprobasmo que  la cvabeceras tenga token y que e,piecew con Bearer que el metodo de autorizacion qu ehemos definfido en el postman
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {//por protocolo tiene que incluir berer qu es el que hemos definido en  el postman para nuestro token, comprueva si tenemos token y si inicia con bearer
        //console.log('Si tiene el token con bearer');

        try {

            token = req.headers.authorization.split(' ')[1];//devolvemos  la posicion 1 que seria todo el token, quitando la parte del Bearer que necesitamos

            const decoded = jwt.verify(token, process.env.JWT_SECRET);// con jwt.verify desciframos el jasonwbetoken de nuestra token para optener nuestro id
            // console.log(decoded);devuelve el token descifrado

            //creamos una sesion con la informacion del veterinario con express icluyendolo el request
            req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado");// Extraemos de las bases de datos, todos menos el password, token y confirmado

            return next();
        } catch (error) {
            const e = new Error("Token no Valido");
           return res.status(403).json({ msg: e.message });

        }

    }
    if (!token) {//si no existe token  mostramos el error y vamos al siguiente middleware
        const error = new Error('Token no valido o inexistente');
        res.status(403).json({ msg: error.message });

    }


    next();//vamos al sigiente middleware

};

export default checkAuth;