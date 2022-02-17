const express = require('express');
const cursoControlador = require('../controllers/curso.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/agregarCurso', md_autenticacion.Auth, cursoControlador.agregarCurso);
api.get('/obtenerCursosMaestro', md_autenticacion.Auth, cursoControlador.obtenerCursosMaestro);
api.put('/editarCurso/:idCurso', md_autenticacion.Auth, cursoControlador.editarCurso);
api.delete('/eliminarCurso/:idCurso', md_autenticacion.Auth, cursoControlador.eliminarCurso);

module.exports = api;