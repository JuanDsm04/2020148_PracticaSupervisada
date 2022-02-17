const { find } = require('../models/curso.model');
const Curso = require('../models/curso.model');
const Asignacion = require('../models/asignacion.model');
const mongoose = require('mongoose');

// AGREGAR UN NUEVO CURSO
function agregarCurso(req, res){
    var parametros = req.body;
    var cursoModel = new Curso();

    // IF PARA SOLO LOS DE ROL MAESTRO PUEDAN CREAR CURSOS
    if ( 'ROL_MAESTRO' !== req.user.rol ) return res.status(500)
    .send({ mensaje: 'Los alumnos no tienen acceso a crear cursos'});

        if(parametros.nombreCurso){
            cursoModel.nombreCurso = parametros.nombreCurso;
            cursoModel.idMaestroCurso = req.user.sub;

            Curso.find({nombreCurso: parametros.nombreCurso}, (err, cursoEncontrado)=>{
                if (cursoEncontrado.length == 0){

                    cursoModel.save((err, cursoGuardado) =>{
                        if(err) return res.status(500).send({mensaje: "Error en la peticion"});
                        if(!cursoGuardado) return res.status(500).send({mensaje: "Error al guardar el curso"});

                        return res.status(200).send({curso: cursoGuardado});
                    });
                }else{
                    return res.status(500)
                    .send({mensaje:'Este curso ya esta esta existente'})
                }
            })
        }
    

}

// EDITAR UN CURSO (MODIFICANDO EL NOMBRE DE LOS ALUMNOS AL VISUALIZARLOS)
function editarCurso(req, res){
    var idCurs = req.params.idCurso;
    var parametros = req.body;

    // IF PARA SOLO LOS DE ROL MAESTRO PUEDAN MODIFICAR
    if ( 'ROL_MAESTRO' !== req.user.rol ) return res.status(500)
    .send({ mensaje: 'Los alumnos no tienen acceso a modificar los cursos'});

    // IF PARA QUE SOLO EL MAESTRO CREADOR PUEDA MODIFICAR SUS CURSOS
    //necesita de una KEY en postman con el id del profesor para que solo el pueda modificar sus cursos
    if ( parametros.idMaestroCurso !== req.user.sub ) return res.status(500)
    .send({ mensaje: 'No puede modificar los cursos de otros maestros'});

    Curso.findByIdAndUpdate(idCurs, parametros, {new: true} ,(err, cursoActualizado) => {
        if (err) return res.status(500)
            .send({mensaje: 'error en la peticion'});
        if(!cursoActualizado) return res.status(404)
            .send({mensaje: "Error al editar el Curso'"});

        return res.status(200).send({curso: cursoActualizado});
    })

}

// ELIMINAR UN CURSO 
function eliminarCurso(req, res) {
    var idCurs = req.params.idCurso;
    var parametros = req.body;

    //necesita de una KEY en postman con el id del profesor para que solo el pueda eliminar sus cursos
    if ( parametros.idMaestroCurso !== req.user.sub ) return res.status(500) 
    .send({ mensaje: 'No puede eliminar los cursos de otros maestros'});

    //CAMBIO DE ALUMNOS A EL CURSO DEFAULT
    Curso.findOne( {nombreCurso:'default'},(err, cursoEncontrado) =>{
        Asignacion.updateMany({idCurso:idCurs},{idCurso: mongoose.Types.ObjectId(cursoEncontrado._id)},(err, cambio)=>{
            Curso.findOneAndDelete({ idMaestroCurso: req.user.sub,_id: idCurs }, (err, cursoEliminado)=> {
                if (err)return res.status(500).send({mensaje: 'Error al eliminar el curso'});
                if (!cursoEliminado)return res.status(500).send({mensaje: 'Solo puede eliminar sus cursos'});
                return res.status(200).send({mensaje: 'El curso fue eliminado correctamente'});
            })
        })
    })
}

// VISUALIZAR LOS CURSOS DE CADA MAESTRO
function obtenerCursosMaestro(req, res){
    Curso.find({ idMaestroCurso : req.user.sub }, (err, cursosEncontrados) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!cursosEncontrados) return res.status(500).send({ mensaje: "Error al obtener los cursos"});

        return res.status(200).send({ cursos: cursosEncontrados });
    })
}

module.exports = {
    agregarCurso,
    obtenerCursosMaestro,
    editarCurso,
    eliminarCurso
}