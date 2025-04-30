const sequelize = require("../../database/conection");

// Controlador para listar todos los PPL
const listarPPL = async (req, res) => {
  console.log("listarPPL");
  try {
    const [ppl] = await sequelize.query(
      "SELECT * FROM ppl;"
    );

    console.log("ppl", ppl);

    res.status(200).json({
      mensaje: "PPL obtenidos exitosamente",
      ppl,
    });
  } catch (error) {
    console.log("Error al listar PPL:", error);
    res.status(500).json({
      mensaje: "Error en el servidor",
      error: error.message,
    });
  }
};

// Controlador para obtener un PPL por ID
const obtenerPPLPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        mensaje: "Se requiere un ID para buscar el PPL",
      });
    }
    
    const [ppl] = await sequelize.query(
      `select * from ppl where ppl.Td = ${id}`
    );
    
    if (ppl.length === 0) {
      return res.status(404).json({
        mensaje: "PPL no encontrado",
      });
    }
    
    res.status(200).json({
      mensaje: "PPL obtenido exitosamente",
      ppl: ppl[0],
    });
  } catch (error) {
    console.log("Error al obtener PPL por ID:", error);
    res.status(500).json({
      mensaje: "Error en el servidor",
      error: error.message,
    });
  }
};

module.exports = {
  listarPPL,
  obtenerPPLPorId
};
