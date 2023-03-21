//importasmo el model para poder trabajar con las bases de datos
import Paciente from '../models/Paciente.js';


const agregarPaciente = async (req, res)=>{
 
    const paciente = new Paciente(req.body);//instanciamos con el modelo paciente y pasamos los datos a la varibale paciente
    //console.log(paciente);
    paciente.veterinario = req.veterinario._id;//de la sesion req.veterinario  donde habiamos alamcenado la informacion de vetrinario, posasmo su id la paciente para almanceralo en la bases de datos

    try{
        const pacienteGuardado = await paciente.save();//guardamos los datos en mongoDB

        res.json(pacienteGuardado);//mostramos los datos en el postman
        
        console.log(paciente);//mostramos los datos por consola

    }catch(error){
        console.log(error)
    }
 
}



const obtenerPacientes = async (req, res)=>{

    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);

    res.json(pacientes);

}

const obtenerPaciente = async(req,res)=>{
    //console.log(req.params.id);
    const { id }= req.params;//cogemos el id del paciente que estamos enviando para posteormente compararlo
    const paciente = await Paciente.findById(id);


    if(!paciente){//si no existe 
        res.status(404).json({msg:'No encontrado'});

    }

    //comprobamos que el veterinario es el mismo que ingreso al paciente en las bases de datos
    if(paciente.veterinario.toString() !== req.veterinario._id.toString()){//nota convertir siempre en string los id de mongodb, porque no los comporar como si fuesen iguales.
        return res.json({ msg:'Accion no valida'});
    }

    //Sí existe y tiene token lo mostramos
    res.json(paciente);


    
}


const actualizarPaciente = async(req,res)=>{
    const { id }= req.params;//cogemos el id del paciente que estamos enviando para posteormente compararlo
    //console.log(id);
    const paciente = await Paciente.findById({_id:id});
     

    
    if(!paciente){//si no existe 
        res.status(404).json({msg:'No encontrado'});

    }

    //comprobamos que el veterinario es el mismo que ingreso al paciente en las bases de datos
    if(paciente.veterinario.toString() !== req.veterinario._id.toString()){//nota convertir siempre en string los id de mongodb, porque no los comporar como si fuesen iguales.
        return res.json({ msg:'Accion no valida'});
    }

    //Actualizar Paciente, recogemos lo datos del body del postman o le asigamos los que  ya tiene ese objeto
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

   

    
    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
        //return res.json({ msg:'paciente actualizado'});
       
        
    } catch (error) {
        console.log(error);
    }


}




const eliminarPaciente = async(req,res)=>{
    const { id }= req.params;//cogemos el id del paciente que estamos enviando para posteormente compararlo
    const paciente = await Paciente.findById(id);

    if(!paciente){//si no existe 
        res.status(404).json({msg:'No encontrado'});

    }

    //comprobamos que el veterinario es el mismo que ingreso al paciente en las bases de datos
    if(paciente.veterinario.toString() !== req.veterinario._id.toString()){//nota convertir siempre en string los id de mongodb, porque no los comporar como si fuesen iguales.
        return res.json({ msg:'Accion no valida'});
    }


    try {
        const pacienteEliminado = await paciente.deleteOne();
        res.json({msg:'el paciente fue eliminado'});
        
    } catch (error) {
        console.log(error);
        
    }
    

}

export  { agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente };