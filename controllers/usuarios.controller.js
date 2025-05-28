const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const { db } = require('../database/firestore.config');

const usuariosGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  try {
    const usuariosRef = db.collection('usuarios');
    const snapshot = await usuariosRef.where('estado', '==', true).get();

    if (snapshot.empty) {
      return res.json({ total: 0, usuarios: [] });
    }
    const todos = [];
    snapshot.forEach(doc => {
      todos.push({ id: doc.id, ...doc.data() });
    });
    // Simulamos paginación manual
    const usuarios = todos.slice(Number(desde), Number(desde) + Number(limite));
    res.json({ total: todos.length, usuarios });
    } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener usuarios' });
  }
};

const usuariosPost = async (req, res = response) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    const passwordEncriptado = bcryptjs.hashSync(password, salt);

    // Crear el objeto del nuevo usuario
    const nuevoUsuario = {
      nombre,
      correo,
      password: passwordEncriptado,
      rol,
      estado: true
    };

    // Guardar en Firestore en la colección 'usuarios'
    const docRef = await db.collection('usuarios').add(nuevoUsuario);

    res.status(201).json({
      msg: 'Usuario creado en Firebase',
      id: docRef.id,
      usuario: nuevoUsuario
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear usuario' });
  }
};

const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { password, ...resto } = req.body;

  try {
    if (password) {
      const salt = bcryptjs.genSaltSync();
      resto.password = bcryptjs.hashSync(password, salt);
    }

    const userRef = db.collection('usuarios').doc(id);
    await userRef.update(resto);

    const actualizado = await userRef.get();

    res.json({ id, ...actualizado.data() });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar usuario' });
  }
};

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;

  try {
    const userRef = db.collection('usuarios').doc(id);
    await userRef.update({ estado: false });

    const usuarioActualizado = await userRef.get();

    res.json({
      msg: 'Usuario marcado como inactivo',
      id,
      ...usuarioActualizado.data()
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar usuario' });
  }
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete
};