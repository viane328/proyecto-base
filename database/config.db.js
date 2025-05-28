// database/config.db.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const dbConnection = async () => {
  try {
    await prisma.$connect();
    console.log('Base de datos SQLite conectada con Prisma');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw new Error('Error al iniciar la base de datos');
  }
};

module.exports = {
  dbConnection,
  prisma,
};