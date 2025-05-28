const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config.db');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios'

        //conectar a base de datos
        this.conectarDB()

        //Middlewares
        this.middlewares();

        //lectura y parseo del body
        this.app.use( express.json());

        //Rutas de mi aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        //CORS
        this.app.use( cors() );
        //directorio publico express
        this.app.use( express.static('public'));
    }

    routes(){
        this.app.use( this.usuariosPath , require('../routes/usuarios.route'));
    }

    listen(){
        this.app.listen(this.port, () =>{
            console.log('Servidor corriendo en puerto', this.port); 
        });
    }

}

module.exports = Server;