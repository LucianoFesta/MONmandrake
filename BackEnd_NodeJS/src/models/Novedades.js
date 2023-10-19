
const mongoose = require("mongoose");

const novedadSchema = new mongoose.Schema(
  {
    autor: String,
    responsable: String,
    createdAt: String,
    updatedAt: String,
    descripcion: String,
    etiquetas: Array,
    estado: Number,
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Novedad", novedadSchema);
