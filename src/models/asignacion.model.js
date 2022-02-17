const mongoose = require ('mongoose');
var Schema = mongoose.Schema;

const AsignacionesSchema = Schema({
    idCurso: {type: Schema.Types.ObjectId, ref: 'cursos'},
    idAlumno: {type: Schema.Types.ObjectId, ref: 'alumnos'}
});

module.exports = mongoose.model('asignaciones', AsignacionesSchema);