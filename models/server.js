const express = require('express');
const cors = require('cors');
require('dotenv').config();

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    // Rutas de tu app
    this.usuariosPath = '/api/usuarios';

    // Middlewares
    this.middlewares();

    // Rutas
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.usuariosPath, require('../routes/usuarios'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Servidor corriendo en puerto', this.port);
    });
  }
}

module.exports = Server;