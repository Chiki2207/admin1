const sequelize = require("../../database/conection");
const bcrypt = require("bcrypt");
const { generarToken } = require("../../middleware/authMiddleware");
const AccessLog = require("../models/MAccessLog");

// Controlador de login
const login = async (req, res) => {
  const { Username, Password } = req.body;
  const ipAddress = req.ip || req.connection.remoteAddress;
  
  try {
    const [usuarios] = await sequelize.query(
      `SELECT * FROM usuarios WHERE Username = '${Username}'`
    );

    if (usuarios.length === 0) {
      // Registrar intento fallido
      await AccessLog.create({
        username: Username,
        success: false,
        ipAddress
      });
      
      return res.status(401).json({ mensaje: "Usuario no encontrado" });
    }

    const usuario = usuarios[0];
    const passwordValida = await bcrypt.compare(Password, usuario.Password);

    if (!passwordValida) {
      // Registrar intento fallido
      await AccessLog.create({
        username: Username,
        success: false,
        ipAddress
      });
      
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    if (!usuario.Estado) {
      // Registrar intento fallido
      await AccessLog.create({
        username: Username,
        success: false,
        ipAddress
      });
      
      return res.status(401).json({ mensaje: "Usuario inactivo" });
    }

    const token = generarToken(usuario);
    
    // Registrar inicio de sesión exitoso
    await AccessLog.create({
      username: Username,
      success: true,
      ipAddress,
      token
    });

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        IdUsuario: usuario.IdUsuario,
        Username: usuario.Username,
        Rol: usuario.Rol,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

// Controlador de registro
const register = async (req, res) => {
  const { Username, Password, Rol } = req.body;
  try {
    const [usuariosExistentes] = await sequelize.query(
      `SELECT * FROM usuarios WHERE Username = '${Username}'`
    );

    if (usuariosExistentes.length > 0) {
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    await sequelize.query(
      `INSERT INTO usuarios (Username, Password, Rol, Estado ) 
       VALUES ('${Username}', '${hashedPassword}', '${Rol}', 1)`
    );

    res.status(201).json({ mensaje: "Usuario creado exitosamente" });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};


module.exports = {
  login,
  register
};
