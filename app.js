// IMPORTACIONES
const express = require ('express');
const cors = require ('cors');
var app = express();

// IMPORTACIONES RUTAS
const UsuarioRutas = require('./src/routes/usuario.routes');
const CursoRutas = require('./src/routes/curso.routes');
const AsignacionRutas = require('./src/routes/asignacion.routes')

//MIDDLEWARES -> INTERMEDIARIOS
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// CABECERAS
app.use(cors());

// CARGA DE RUTAS
app.use('/api',  UsuarioRutas, CursoRutas, AsignacionRutas);

module.exports = app;