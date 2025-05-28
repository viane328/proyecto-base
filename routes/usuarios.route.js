const { Router } = require('express');
const { check } = require('express-validator');

const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete
} = require('../controllers/usuarios.controller');

const { validarCampos } = require('../middlewares/validar_campos_md');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db_validators');

const router = Router();

// GET usuarios
router.get('/', usuariosGet);

// PUT usuario por ID
router.put('/:id', [
  check('id').custom(existeUsuarioPorId),
  check('rol').custom(esRoleValido),
  validarCampos
], usuariosPut);

// POST nuevo usuario
router.post('/', [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'El password debe tener al menos 6 caracteres').isLength({ min: 6 }),
  check('correo', 'El correo no es válido').isEmail(),
  check('correo').custom(emailExiste),
  check('rol').custom(esRoleValido),
  validarCampos
], usuariosPost);

// DELETE usuario por ID
router.delete('/:id', [
  check('id').custom(existeUsuarioPorId),
  validarCampos
], usuariosDelete);

module.exports = router;
