require('dotenv').config();
const fs = require('fs');
const { dbConnection } = require('./database/config.db');
const Server = require('./models/server');

console.log("PORT desde app.js:", process.env.PORT);
console.log('¿Existe .env?:', fs.existsSync('.env'));

const main = async () => {
  await dbConnection(); // Conexión a la base de datos SQLite usando Prisma

  const server = new Server();
  server.listen();
};

main();