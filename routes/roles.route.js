const { Router } = require('express');
const { crearRol } = require('../controllers/roles.controller');

const router = Router();

router.post('/', crearRol);

module.exports = router;
