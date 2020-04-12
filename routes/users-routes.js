const express = require('express');
// const bodyParser = require('body-parser');
const { createUser, userLogin, getUser } = require('../controllers/users-controller');
const { check } = require('express-validator');
const { authorizeUser } = require('../middlewares/middleware.js');

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// app.use(bodyParser.json());


//Route for registration
 app.post('/users', 
 [
    check('first_name')
        .isAlpha()
        .withMessage('First name must be alphabets only')
        .isLength({min: 3, max: 20})
        .withMessage('First name be of 3 characters and above'),
    check('last_name')
        .isAlpha()
        .withMessage('First name must be alphabets only')
        .isLength({min: 3, max: 20})
        .withMessage('First name be of 3 characters and above'),
    check('email', 'Email must be valid').isEmail(),
    check('phone_no', 'Mobile number must be valid').isMobilePhone(),
    check('password')
        .isLength({min: 5})
        .withMessage('Password must have a minimum length of 5')
], createUser);

//endpoint for logging in
app.post('/users/login', userLogin);

//endpoint for getting user profile details
app.get('/me', authorizeUser, getUser);

module.exports = app;