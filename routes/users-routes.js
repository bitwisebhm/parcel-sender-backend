const express = require('express');
const { createUser, userLogin, getUser } = require('../controllers/users-controller');
const { check } = require('express-validator');
const { authorizeUser } = require('../middlewares/middleware.js');

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


//Endpoint to create User acct
app.post('/users', 
[
    check('password')
        .isLength({min: 5})
        .withMessage('Password must have a minimum length of 5'),

    check('phone_no', 'Mobile number must be valid')
        .matches(/^[+][1-9][0-9]*$/)
        .withMessage('please include your country code.. e.g +2347061234567'),   
        
    check('email', 'Email must be valid').isEmail(),
        
    check('last_name')
        .isAlpha()
        .withMessage('Last name must be alphabets only')
        .isLength({min: 1, max: 20})
        .withMessage('Last name be of 1 character and above'),

    check('first_name')
        .isAlpha()
        .withMessage('First name must be alphabets only')
        .isLength({min: 1, max: 20})
        .withMessage('First name must be of 1 character and above')

], createUser);


//endpoint for logging in
app.post('/users/login', userLogin);

//endpoint for getting user profile details
app.get('/me', authorizeUser, getUser);

module.exports = app;