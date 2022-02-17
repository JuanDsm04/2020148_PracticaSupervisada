const Asignacion = require('../models/asignacion.model');
const bcrypt = require('bcrypt-nodejs')
const jwt = require('../services/jwt');

// AGREGAR UNA ASIGNACION DE CURSOS PARA EL ALUMNO(no agregara si tiene mas de 3 asignaciones y si ya la tiene repetida)
function registrarAsignacion(req, res){
    var parametros = req.body;
    var asignacionModel = new Asignacion();

    if(parametros.idCurso && parametros.idAlumno){
        asignacionModel.idCurso = parametros.idCurso;
        asignacionModel.idAlumno = parametros.idAlumno;

        // IF PARA SOLO LOS DE ROL ALUMNO PUEDAN ASIGNARSE UN CURSO
        if ( 'ROL_ALUMNO' !== req.user.rol ) return res.status(500)
        .send({ mensaje: 'Los maestros no pueden asignarle los cursos a los alumnos'});

        //Evitar que se asigne un curso repetido
        Asignacion.find({idCurso: parametros.idCurso, idAlumno:req.user.sub}, (err, cursoEncontrado)=>{ 
            if (cursoEncontrado.length == 0){

                //Evitar que se asigne mas de tres cursos
                Asignacion.find({idAlumno: parametros.idAlumno}, (err, alumnoEncontrado)=>{ 
                    if (alumnoEncontrado.length < 3){

                            asignacionModel.save((err, asignacionGuardada)=>{
                                if(err) return res.status(500)
                                .send({mensaje: 'Error en la peticion'});
                                if(!asignacionGuardada) return res.status(500)
                                .send({mensaje: 'Error al agregar la asignacion'});

                                return res.status(200).send({asignacion: asignacionGuardada});
                            });
                    }else{
                        return res.status(500)
                        .send({mensaje:'No puedes estar asignado en mas de 3 cursos'})
                    }
                })

                    
            }else{
                return res.status(500)
                .send({mensaje:'Este curso ya lo tienes asignado o no tienes permitido asignarlo'})
            }
        })
    }
}

// VISUALIZAR LOS CURSOS EN LOS QUE SE ENCUENTRA ASIGNADO EL ALUMNO
function obtenerAsignacionesAlumno(req, res) {
    Asignacion.find({ idAlumno : req.user.sub }, (err, asignacionesEncontradas) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!asignacionesEncontradas) return res.status(500).send({ mensaje: "Error al obtener las asignaciones"});

        return res.status(200).send({ asignaciones: asignacionesEncontradas });
    }).populate('idCurso', 'nombreCurso')
}

module.exports = {
    registrarAsignacion,
    obtenerAsignacionesAlumno
}