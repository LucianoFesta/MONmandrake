
const mongoose = require("mongoose");

const novedadSchema = new mongoose.Schema(
  {
    autor: String,
    responsable: String,
    descripcion: String,
    estado: Number,
    etiquetas: Array,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Novedad", novedadSchema);
