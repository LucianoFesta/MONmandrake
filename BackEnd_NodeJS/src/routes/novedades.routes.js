const express = require("express");
const novedadController = require("../controllers/novedades.controllers");
const router = express.Router();


router.get("/novedades/listado", novedadController.listarNovedades);
router.post("/novedades/crearNovedad",novedadController.crearNovedad );
router.get("/novedades/buscarNovedad/:id", novedadController.buscarNovedadById );
router.put("/novedades/editarNovedad/:id", novedadController.editarNovedad );
router.delete("/novedades/eliminarNovedad/:id", novedadController.eliminarNovedad );

//Busqueda:
router.get("/novedades/listByKeyword", novedadController.buscarNovedadPorPalabra);
router.get("/novedades/listByTags", novedadController.buscarNovedadPorEtiqueta);
router.get("/novedades/listByKeywordAndTags", novedadController.buscarNovedadPorEtiquetaYPalabra);



module.exports = router;
