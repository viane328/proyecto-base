require('dotenv').config();

console.log("PORT desde app.js:", process.env.PORT);

const Server = require('./models/server');
const server = new Server();
server.listen();
