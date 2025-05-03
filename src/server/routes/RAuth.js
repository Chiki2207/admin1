const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../../middleware/authMiddleware');
const {
  login,
  register
} = require('../controladores/CAuth.js');

// Rutas públicas de autenticación
router.post('/login', login);

// Rutas privadas de autenticación
router.post('/register', verificarToken, verificarRol(['ADMIN']), register);

module.exports = router; 