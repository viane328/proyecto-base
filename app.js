require('dotenv').config();
console.log("MONGO_CNN desde app.js:", process.env.MONGO_URI);
console.log("PORT desde app.js:", process.env.PORT);
const fs = require('fs');
console.log('¿Existe .env?:', fs.existsSync('.env'));

const Server = require('./models/server');

const server = new Server();

server.listen();
