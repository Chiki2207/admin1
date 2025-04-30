const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../../middleware/authMiddleware');
const {
  listarUsuarios,
  listarUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require('../controladores/CUsers.js');

// Rutas de gestión de usuarios
router.get('/', verificarToken, verificarRol(['ADMIN']), listarUsuarios); // Listar todos los usuarios 
router.get('/:IdUsuario', verificarToken, verificarRol(['ADMIN']), listarUsuario); // Listar un usuario por ID
router.put('/:IdUsuario', verificarToken, verificarRol(['ADMIN']), actualizarUsuario); // Actualizar un usuario por ID
router.delete('/:IdUsuario', verificarToken, verificarRol(['ADMIN']), eliminarUsuario); // Eliminar un usuario por ID

module.exports = router; 