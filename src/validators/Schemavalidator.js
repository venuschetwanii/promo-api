const express = require('express')
const { check, validationResult } = require('express-validator');
const app = express()

//validating the signup user
exports.loginValidator = [

    check('email')
        .isEmail()
        .withMessage('Incorrect email')
        .exists(),
    check('password')
        .isLength({ min: 6 })
        .withMessage('user password must be atleast 6 or more than it characters'),

]

//validating the new user which is been created
exports.addUserValidator = [

    check('firstName')
        .isLength({ min: 2, max: 16 })
        .withMessage('Username must be at least 4 and no more than 16 characters'),
    check('lastName')
        .isLength({ min: 2, max: 16 })
        .withMessage('Username must be at least 4 and no more than 16 characters'),
    check('email')
        .isEmail()
        .withMessage('Incorrect email')

]

//checking the validation
exports.userValidation = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    next();

}

