const express = require("express");
const router = new express.Router();
require("../config/db");
const authControllers = require('../controllers/auth.controller')
const auth = require("../middleware/auth")
const { addUserValidator, loginValidator, userValidation } = require('../validators/Schemavalidator')


//CRUD operations on user
router.post("", auth, addUserValidator, userValidation, authControllers.addUser)
router.post("/register", authControllers.register)
router.post("/login", loginValidator, userValidation, authControllers.loginUser)
router.get("/logout", auth, authControllers.logouttoken);
router.get("/logouts", auth, authControllers.logoutAll)
router.put("/forgetpassword", authControllers.forgetpassword)
router.put("/resetpassword", authControllers.resetpassword)
router.put("/changepassword", auth, authControllers.changepwd)

module.exports = router

