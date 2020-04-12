const express = require('express');
// const bodyParser = require('body-parser');
const { createParcel, getAllParcels, changePresentLocation, changeDestination, changeStatus, cancelParcel } = require('../controllers/percels-controller');
const { check } = require('express-validator');
// import * as validator from 'express-validator';
const { authorizeUser} = require('../middlewares/middleware.js');

const app = express();

app.use(express.json());

// app.use(bodyParser.json());

//create a new parcel order
app.post('/parcels', [ check('recipient_phone_no', 'Please enter a valid mobile Number').isMobilePhone() ], authorizeUser, createParcel);

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

