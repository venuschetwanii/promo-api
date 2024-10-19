require("dotenv").config();
require("../config/db");
const express = require("express");
const router = new express.Router();
const formControllers = require("../controllers/form.controller")
const auth = require("../middleware/auth")



//CRUD operations on form
router.post("", auth, formControllers.addform)
router.get("/getallforms", auth, formControllers.getform)
router.get("/:id", auth, formControllers.getformById)
router.put("/:id", auth, formControllers.AnswerspatchById);
router.delete("/:id", auth, formControllers.formdeleteById);

module.exports = router