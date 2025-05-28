const express = require('express');
const cors = require('cors');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = '/api/usuarios';
    
    // Middlewares
    this.middlewares();

    // lectura y parseo del body
    this.app.use(express.json());

    // Rutas
    this.routes();
  }

  
  middlewares() {
    this.app.use(cors());
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use('/api/roles', require('../routes/roles.route'));
    this.app.use(this.usuariosPath, require('../routes/usuarios.route'));

  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Servidor corriendo en puerto', this.port);
    });
  }
}

module.exports = Server;
