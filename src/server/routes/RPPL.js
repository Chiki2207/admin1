const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../../middleware/authMiddleware');
const {listarPPL,obtenerPPLPorId} = require('../controladores/CPPL.js');

// Rutas para PPLs
router.get('/', verificarToken, listarPPL);
router.get('/:id', verificarToken, obtenerPPLPorId);

module.exports = router; 