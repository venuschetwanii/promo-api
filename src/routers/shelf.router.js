require("dotenv").config();
require("../config/db");
const express = require("express");
const router = new express.Router();
const shelfControllers = require("../controllers/shelf.controller")
const auth = require("../middleware/auth")


//CRUD operations on ShelfUser
router.post("", auth, shelfControllers.addshelfUser)
router.get("/getallshelf", auth, shelfControllers.getshelfUser)
router.get("/excelfile", shelfControllers.excelfile)
router.post("/upload", shelfControllers.upload.single("upload"), auth, shelfControllers.uploadXLSX);
router.get("/:id", auth, shelfControllers.shelfuserById)
router.patch("/:id", auth, shelfControllers.shelfpatchById);
router.delete("/:id", auth, shelfControllers.shelfdeleteById);



module.exports = router