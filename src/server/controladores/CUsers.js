const sequelize = require("../../database/conection");
const bcrypt = require("bcrypt");

// Controlador para listar usuarios
const listarUsuarios = async (req, res) => {
  console.log("listarUsuarios");
  try {
    const [usuarios] = await sequelize.query(
      "SELECT IdUsuario, Username, Rol, Estado FROM usuarios"
    );

    console.log("usuarios", usuarios);

    res.status(200).json({
      mensaje: "Usuarios obtenidos exitosamente",
      usuarios,
    });
  } catch (error) {
    console.log("Error al listar usuarios:", error);
    res.status(500).json({
      mensaje: "Error en el servidor",
      error: error.message,
    });
  }
};

const listarUsuario = async (req, res) => {
  const { IdUsuario } = req.params;
  const [usuarios] = await sequelize.query(
    `SELECT * FROM usuarios WHERE IdUsuario = ${IdUsuario}`
  );
  res.status(200).json({
    mensaje: "Usuario obtenido exitosamente",
    usuarios: {
      IdUsuario: usuarios[0].IdUsuario,
      Username: usuarios[0].Username,
      Rol: usuarios[0].Rol,
      Estado: usuarios[0].Estado,
    },
  });
};

// Controlador para actualizar usuario
const actualizarUsuario = async (req, res) => {
  try {
    const { IdUsuario } = req.params;
    const { Username, Password, Rol, Estado } = req.body;
    const usuarioActual = req.usuario?.Username || 'SISTEMA'; // Obtener el usuario actual del token o usar 'SISTEMA' si no hay usuario

    const [usuarios] = await sequelize.query(
      `SELECT * FROM usuarios WHERE IdUsuario = ${IdUsuario}`
    );

    if (usuarios.length === 0) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    const usuario = usuarios[0];

    const datosActualizados = {};
    if (Username) datosActualizados.Username = Username;
    if (Password) {
      const salt = await bcrypt.genSalt(10);
      datosActualizados.Password = await bcrypt.hash(Password, salt);
    }
    if (Rol) datosActualizados.Rol = Rol;
    if (Estado !== undefined) datosActualizados.Estado = Estado;

    // Establecer el usuario actual antes de la operación
    await sequelize.query(`SET @usuario_actual = '${usuarioActual}'`);
    
    await sequelize.query(
      `UPDATE usuarios 
       SET Username = '${datosActualizados.Username || usuario.Username}',
           Password = '${datosActualizados.Password || usuario.Password}',
           Rol = '${datosActualizados.Rol || usuario.Rol}',
           Estado = ${
             datosActualizados.Estado !== undefined
               ? datosActualizados.Estado
               : usuario.Estado
           }
       WHERE IdUsuario = ${IdUsuario}`
    );

    res.status(200).json({
      mensaje: "Usuario actualizado exitosamente",
      usuario: {
        id: usuario.IdUsuario,
        username: datosActualizados.Username || usuario.Username,
        rol: datosActualizados.Rol || usuario.Rol,
        estado:
          datosActualizados.Estado !== undefined
            ? datosActualizados.Estado
            : usuario.Estado,
      },
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({
      mensaje: "Error en el servidor",
      error: error.message,
    });
  }
};

// Controlador para eliminar usuario
const eliminarUsuario = async (req, res) => {
  try {
    const { IdUsuario } = req.params;
    const usuarioActual = req.usuario?.Username || 'SISTEMA'; // Obtener el usuario actual del token o usar 'SISTEMA' si no hay usuario

    const [usuarios] = await sequelize.query(
      `SELECT * FROM usuarios WHERE IdUsuario = ${IdUsuario}`
    );

    if (usuarios.length === 0) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    // Establecer el usuario actual antes de la operación
    await sequelize.query(`SET @usuario_actual = '${usuarioActual}'`);
    
    await sequelize.query(
      `DELETE FROM usuarios WHERE IdUsuario = ${IdUsuario}`
    );

    res.status(200).json({
      mensaje: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({
      mensaje: "Error en el servidor",
      error: error.message,
    });
  }
};

module.exports = {
  listarUsuarios,
  listarUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
