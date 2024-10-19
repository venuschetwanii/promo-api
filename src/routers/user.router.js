require("dotenv").config();
require("../config/db");
const auth = require("../middleware/auth")
const express = require("express");
const router = new express.Router();
const userControllers = require('../controllers/user.controller')


//CRUD operations on user
router.get("", userControllers.getAllUser)
router.get("/me", auth, userControllers.getUserauth)
router.get("/:id",auth, userControllers.userById);
router.patch("/:id",auth, userControllers.patchById);
router.delete("/:id",auth, userControllers.deleteById);

module.exports = router