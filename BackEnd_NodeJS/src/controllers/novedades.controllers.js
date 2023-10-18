
const novedadModel = require("../models/Novedades"); // Importa el modelo Mongoose

const novedadController = {
  async listarNovedades(req, res) {
    try {
        const list = await novedadSchema.find().lean();
        res.send(list);
    } catch (error) {
        res.send(error);
    }
  },
  async crearNovedad(req, res) {
    try {
      const novedad = novedadModel(req.body); // Utiliza el modelo, no el esquema
      await novedad.save();

    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
};

module.exports = novedadController;
