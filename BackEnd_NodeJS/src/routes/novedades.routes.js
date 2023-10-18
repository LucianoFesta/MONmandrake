const express = require("express");
const router = express.Router();


router.get("/novedades/listado", (req, res)=>{
    res.send("HOLAA");
});
router.post("/novedades/crearNovedad", );
router.get("/novedades/buscarNovedad/:id", );
router.put("/novedades/editarNovedad/:id", );
router.delete("/novedades/eliminarNovedad/:id", );


module.exports = router;
