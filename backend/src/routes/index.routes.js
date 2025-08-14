const {Router} = require("express");
const router = Router();
const controller = require('../controllers/indexController')

// APIs
router.post("/api/userInterested", controller.inscripcionUsuarioInteresado);

module.exports = router;