require("dotenv").config();
require("../config/db");
const express = require("express");
const router = new express.Router();
const questionControllers = require("../controllers/question.controller")
const auth = require("../middleware/auth")



//CRUD operations on form
router.post("", auth, questionControllers.addQuestion)
router.get("/getallquestions", auth, questionControllers.getQuestion)
router.get("/:id", auth, questionControllers.getQuestionById)
router.put("/:id", auth, questionControllers.questionpatchById);
router.delete("/:id", auth, questionControllers.questiondeleteById);

module.exports = router