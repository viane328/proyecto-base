const { db } = require('../database/firestore.config');

const crearRol = async (req, res) => {
  const { rol } = req.body;

  if (!rol) {
    return res.status(400).json({ msg: 'El rol es obligatorio' });
  }

  try {
    const docRef = db.collection('roles').doc(rol);
    const doc = await docRef.get();

    if (doc.exists) {
      return res.status(400).json({ msg: 'El rol ya existe' });
    }

    await docRef.set({ rol });

    res.json({ msg: `Rol ${rol} creado correctamente` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearRol
};
