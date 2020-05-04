const express = require('express');
// const bodyParser = require('body-parser');
const { createParcel, getParcels, getAllParcels, changePresentLocation, changeDestination, changeStatus, cancelParcel } = require('../controllers/parcels-controller');
const { check } = require('express-validator');
// import * as validator from 'express-validator';
const { authorizeUser} = require('../middlewares/middleware.js');

const app = express();

app.use(express.json());

// app.use(bodyParser.json());

//create a new parcel order
app.post('/parcels', [ 
    check('recipient_phone_no', 'Please enter a valid mobile Number').isMobilePhone()
    .matches(/(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})/g)   
    .withMessage('please include your country code.. e.g -> +2347012345678')
], authorizeUser, createParcel);

//get parcels in the admin page
app.get('/parcels', authorizeUser, getParcels)

//get all parcel orders by a specific user
app.get('/users/:userId/parcels', authorizeUser, getAllParcels);

//change destination of an order
app.patch('/parcels/destination', authorizeUser, changeDestination);

//change status of an order
app.patch('/parcels/status', authorizeUser, changeStatus)

//change present location of an order
app.patch('/parcels/presentLocation', authorizeUser, changePresentLocation);

//cancel an order
app.patch('/parcels/cancel', authorizeUser, cancelParcel);

module.exports = app;

