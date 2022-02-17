// Importacion
const Usuarios = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs')
const jwt = require('../services/jwt');

/* REGISTRAR ALUMNO */
function RegistrarUsuarioAlumno(req, res){
    var parametros = req.body;
    var usuarioModel = new Usuarios();

    if(parametros.nombre && parametros.apellido && parametros.email && parametros.password){
        usuarioModel.nombre = parametros.nombre;
        usuarioModel.apellido = parametros.apellido;
        usuarioModel.email = parametros.email;
        usuarioModel.rol = 'ROL_ALUMNO';

        Usuarios.find({email: parametros.email}, (err, usuarioEncontrado)=>{
            if (usuarioEncontrado.length == 0){

                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada)=>{
                    usuarioModel.password = passwordEncriptada;

                    usuarioModel.save((err, usuarioGuardado)=>{
                        if(err) return res.status(500)
                        .send({mensaje: 'Error en la peticion'});
                        if(!usuarioGuardado) return res.status(500)
                        .send({mensaje: 'Error al agregar el Usuario'});
    
                        return res.status(200).send({usuario: usuarioGuardado});
                    });
                })
            }else{
                return res.status(500)
                .send({mensaje:'Este correo, ya se encuentra utilizado'})
            }
        })
    }
}

/* REGISTRAR MAESTRO */
function RegistrarUsuarioMaestro(req, res){
    var parametros = req.body;
    var usuarioModel = new Usuarios();

    if(parametros.nombre && parametros.apellido && parametros.email && parametros.password){
        usuarioModel.nombre = parametros.nombre;
        usuarioModel.apellido = parametros.apellido;
        usuarioModel.email = parametros.email;
        usuarioModel.rol = 'ROL_MAESTRO';

        Usuarios.find({email: parametros.email}, (err, usuarioEncontrado)=>{
            if (usuarioEncontrado.length == 0){

                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada)=>{
                    usuarioModel.password = passwordEncriptada;

                    usuarioModel.save((err, usuarioGuardado)=>{
                        if(err) return res.status(500)
                        .send({mensaje: 'Error en la peticion'});
                        if(!usuarioGuardado) return res.status(500)
                        .send({mensaje: 'Error al agregar el Usuario'});
    
                        return res.status(200).send({usuario: usuarioGuardado});
                    });
                })
            }else{
                return res.status(500)
                .send({mensaje:'Este correo, ya se encuentra utilizado'})
            }
        })
    }
}

/* LOGIN */
function Login(req, res){
    var parametros = req.body;
    Usuarios.findOne({email: parametros.email}, (err, usuarioEncontrado) => {
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(usuarioEncontrado){

            bcrypt.compare(parametros.password, usuarioEncontrado.password, 
                (err, verificacionPassword) => {
                    if (verificacionPassword){
                        if(parametros.obtenerToken === 'true'){
                            return res.status(200)
                            .send({token: jwt.crearToken(usuarioEncontrado)});
                        } else{
                            usuarioEncontrado.password = undefined;
                            return res.status(200)
                            .send({usuario: usuarioEncontrado});
                        }
                        
                    }else{
                        return res.status(500)
                        .send({mensaje: 'Las contrasenas no coincide'});
                    }
                })

        }else{
            return res.status(500).send({mensaje: 'Error, el correo no se encuentra registrado'});
        }
    })
}

/* EDITAR ALUMNO-PERFIL */
function EditarUsuario(req, res){
    var idUser = req.params.idUsuario;
    var parametros = req.body;

    if ( idUser !== req.user.sub ) return res.status(500)
        .send({ mensaje: 'No puede editar otros usuarios/alumnos'});

    Usuarios.findByIdAndUpdate(req.user.sub, parametros, {new : true},
        (err, usuarioActualizado)=>{
            if(err) return res.status(500)
                .send({ mensaje: 'Error en la peticion' });
            if(!usuarioActualizado) return res.status(500)
                .send({ mensaje: 'Error al editar el Usuario/Alumno'});
            
            return res.status(200).send({usuario : usuarioActualizado})
        })
}

/* ELIMINAR ALUMNO-PERFIL */
function EliminarUsuario (req, res){
    var idUser = req.params.idUsuario;

    if ( idUser !== req.user.sub ) return res.status(500)
        .send({ mensaje: 'No puede eliminar otros usuarios/alumnos'});

    Usuarios.findByIdAndDelete(idUser, (err, usuarioEliminado)=>{
        if(err) return res.status(500).send ({mensaje: 'Error en la peticion'});
        if (!usuarioEliminado) return res.status(404).send ({mensaje: 'Error al eliminar el usuario'});

        return res.status(200).send({mensaje: 'El usuario ha sido eliminado'});
    })
}

module.exports = {
    RegistrarUsuarioAlumno,
    RegistrarUsuarioMaestro,
    Login,
    EditarUsuario,
    EliminarUsuario
}