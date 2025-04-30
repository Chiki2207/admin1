require('dotenv').config();
const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
    const chars = 'luvi12345'.split('');
    // Aplicar una transformación simple (por ejemplo, desplazar cada carácter)
    return chars.map(char => String.fromCharCode(char.charCodeAt(0) + 1)).join('');
};

// Usar la clave secreta ofuscada
const JWT_SECRET = getJwtSecret();

// Función para generar token JWT
const generarToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario.IdUsuario,
      Username: usuario.Username,
      Rol: usuario.Rol,
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
};

const verificarToken = (req, res, next) => {
  const token = req.header('Authorization')
  
  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};

const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ mensaje: 'No autorizado' });
    }

    if (!rolesPermitidos.includes(req.usuario.Rol)) {
      return res.status(403).json({ mensaje: 'No tiene permisos para realizar esta acción' });
    }

    next();
  };
};

module.exports = {
  verificarToken,
  verificarRol,
  JWT_SECRET,
  generarToken
};


