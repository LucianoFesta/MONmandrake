const novedadModel = require("../models/Novedades");
const unorm = require('unorm');

const novedadController = {
  async listarNovedades(req, res) {
    try {
      const list = await novedadModel.find().lean();
      res.send(list);
    } catch (error) {
      const mensajeError = "No se ha podido listar las novedades.";
      res.status(400).json({ error: mensajeError });
    }
  },
  async crearNovedad(req, res) {
    try {
      const novedad = novedadModel(req.body); // Utiliza el modelo, no el esquema
      await novedad.save();
      res.status(201).json({ mensaje: "Creado con exito" });
    } catch (error) {
      const mensajeError = "No se ha podido crear la novedad.";
      res.status(400).json({ error: mensajeError });
    }
  },
  async buscarNovedadById(req, res) {
    try {
      const novedad = await novedadModel.findById(req.params.id).lean();
      res.send(novedad);
    } catch (error) {
      const mensajeError = "No se ha encontrado novedad con ese id.";
      res.status(400).json({ error: mensajeError });
    }
  },
  async editarNovedad(req, res) {
    try {
      const id = req.params.id;
      await novedadModel.findByIdAndUpdate(id, req.body);
      res.status(201).json({ mensaje: "Editado con exito" });
    } catch (error) {
      const mensajeError = "No se ha podido editar la novedad con ese id.";
      res.status(400).json({ error: mensajeError });
    }
  },
  async eliminarNovedad(req, res) {
    try {
      const id = req.params.id;
      await novedadModel.findByIdAndDelete(id);
      res.status(201).json({ mensaje: "Eliminada con exito" });
    } catch (error) {
      const mensajeError = "No se ha podido eliminar la novedad con ese id.";
      res.status(400).json({ error: mensajeError });
    }
  },
  async buscarNovedadPorPalabra(req, res) {
    const palabra = req.query.keyword;
    const palabraNormalizada = unorm.nfc(palabra); //TODO: no funca.
    try {
        const resultados = await novedadModel.find({ descripcion: {
          $regex: palabraNormalizada,
          $options: 'i'
      } });
        res.json(resultados);
    } catch (error) {
        res.status(404).send('Error al buscar por palabra');
    }
  },
  async buscarNovedadPorEtiqueta(req, res){
    const etiqueta = req.query.tags;
    try {
        const resultados = await novedadModel.find({ etiquetas: { $regex: new RegExp(etiqueta, 'i') } });
        res.json(resultados);
    } catch (error) {
        console.error('Error al buscar por etiqueta:', error);
        res.status(404).send('Error al buscar por etiqueta');
    }
  },
  async buscarNovedadPorEtiquetaYPalabra(req, res){
    const palabra = req.query.keyword; 
    const etiqueta = req.query.tags;
    try {
        const resultados = await novedadModel.find({
            $and: [
                { descripcion: { $regex: palabra, $options: 'i' } },
                { etiquetas: { $regex: new RegExp(etiqueta, 'i') } }
            ]
        });
        res.json(resultados);
    } catch (error) {
        console.error('Error al buscar por palabra y etiqueta:', error);
        res.status(404).send('Error al buscar por palabra y etiqueta');
    }
  }
};

module.exports = novedadController;
