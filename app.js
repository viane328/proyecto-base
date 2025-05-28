require('dotenv').config();
const fs = require('fs');
console.log('¿Existe .env?:', fs.existsSync('.env'));

const Server = require('./models/server');

const server = new Server();

server.listen();
