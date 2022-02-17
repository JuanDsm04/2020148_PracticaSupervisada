const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const CursoSchema = Schema ({
    nombreCurso: String,
    idMaestroCurso: {type: Schema.Types.ObjectId, ref: 'maestros'}
});

module.exports = mongoose.model('cursos', CursoSchema);