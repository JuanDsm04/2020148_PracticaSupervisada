const mongoose = require('mongoose');
const app = require('./app');

mongoose.Promise = global.Promise;

const Usuarios = require('./src/models/usuario.model');

const Cursos = require('./src/models/curso.model');

const bcrypt = require('bcrypt-nodejs')

mongoose.connect('mongodb://localhost:27017/IN6BM', {useNewUrlParser: true, useUnifiedTopology:true}).then(()=>{
    console.log("Se encuentra conectado a la base de datos.");

    app.listen(3000, function(){
        
        /* USUARIO MAESTRO POR DEFECTO */
        Usuarios.find({email:'MAESTRO'}, (err, usuarioEcontrado)=>{
            if(usuarioEcontrado == 0){
                bcrypt.hash('123456', null, null, (err, passwordEncriptada)=>{
                    Usuarios.create({
                        nombre: 'Erick',
                        apellido: 'Bran',
                        email: 'MAESTRO',
                        password: passwordEncriptada,
                        rol: 'ROL_MAESTRO'
                    })
                });
            }else{
            }
        });

        /* EL CURSO POR DEFECTO */
        Cursos.find({nombreCurso:'default'}, (err, cursoEncontrado) => {
            if (cursoEncontrado.length==0) {
                Cursos.create ({
                    nombreCurso: "default",
                    idMaestro: null
                })
            }
        })

        console.log("Hola Mundo, esta corriendo en el puerto 3000")
    })
    
}).catch(error => console.log(error));
