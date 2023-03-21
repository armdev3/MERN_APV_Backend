import jsonwebtoken from 'jsonwebtoken';


//generamos el json web tocken y pasamos el is como parametro que recibimos desde controler
const generarJWT = (id) => {

    return jsonwebtoken.sign({ id :id }, process.env.JWT_SECRET, {//pasamos el usuario y la variable de entorno que contiene la constraseña
        expiresIn: "30d",//indicamos que caduque en 30 dias
    })

}

export default generarJWT;