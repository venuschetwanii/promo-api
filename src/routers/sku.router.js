require("dotenv").config();
require("../config/db");
const express = require("express");
const router = new express.Router();
const skuControllers = require("../controllers/sku.controller")
const auth = require("../middleware/auth")



//CRUD operations on skuUser
router.post("", auth, skuControllers.addskuUser)
router.get("/getallsku", auth, skuControllers.getskuUser)
router.get("/:id", auth, skuControllers.skuuserById)
router.patch("/:id", auth, skuControllers.skupatchById);
router.delete("/:id", auth, skuControllers.skudeleteById);

module.exports = router