
const mongoose = require("mongoose");

const novedadSchema = new mongoose.Schema(
  {
    autor: String,
    responsable: String,
    created_at: String,
    updated_at: String,
    descripcion: String,
    etiquetas: Array,
    estado: Number,
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Novedad", novedadSchema);
