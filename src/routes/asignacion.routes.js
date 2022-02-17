const express = require('express');
const asignacionControlador = require('../controllers/asignacion.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/registrarAsignacion',  md_autenticacion.Auth, asignacionControlador.registrarAsignacion);
api.get('/obtenerAsignacionesAlumno', md_autenticacion.Auth, asignacionControlador.obtenerAsignacionesAlumno);

module.exports = api;