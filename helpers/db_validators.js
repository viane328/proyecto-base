const { db } = require('../database/firestore.config');

// Verifica si un rol existe en la colección 'roles'
const esRoleValido = async (rol = '') => {
    const rolesRef = db.collection('roles');
    const snapshot = await rolesRef.where('rol', '==', rol).get();

    if (snapshot.empty) {
        throw new Error(`El rol ${rol} no está registrado en la base de datos`);
    }
};

// Verifica si un correo ya está registrado en 'usuarios'
const emailExiste = async (correo = '') => {
    const usuariosRef = db.collection('usuarios');
    const snapshot = await usuariosRef.where('correo', '==', correo).get();

    if (!snapshot.empty) {
        throw new Error(`El correo: ${correo}, ya está registrado`);
    }
};

// Verifica si un usuario existe por ID (Firestore doc ID)
const existeUsuarioPorId = async (id = '') => {
    const doc = await db.collection('usuarios').doc(id).get();

    if (!doc.exists) {
        throw new Error(`El ID no existe: ${id}`);
    }
};

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
};
