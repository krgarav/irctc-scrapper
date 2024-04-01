const express = require("express");
const router = express.Router();
const homeController = require("../controller/amazon ");

router.get("/getdata", homeController.getResult);
router.get("/getirctc",homeController.getIrctc)
module.exports = router;