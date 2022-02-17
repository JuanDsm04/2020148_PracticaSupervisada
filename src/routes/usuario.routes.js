const express = require('express');
const usuarioControlador = require('../controllers/usuario.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api = express.Router();

api.post('/registrarAlumno', usuarioControlador.RegistrarUsuarioAlumno);
api.post('/registrarMaestro', usuarioControlador.RegistrarUsuarioMaestro);
api.post('/login', usuarioControlador.Login);
api.put('/editarUsuario/:idUsuario', md_autenticacion.Auth, usuarioControlador.EditarUsuario);
api.delete('/eliminarUsuario/:idUsuario', md_autenticacion.Auth, usuarioControlador.EliminarUsuario);

module.exports = api;