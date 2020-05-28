const express = require('express');
const { createParcel, getParcels, getAllParcels, changePresentLocation, changeDestination, changeStatus, cancelParcel } = require('../controllers/parcels-controller');
const { check } = require('express-validator');
const { authorizeUser} = require('../middlewares/middleware.js');

const app = express();

app.use(express.json());


//create a new parcel order
app.post('/parcels', [ 
    
    check('recipient_phone_no')
        .matches(/^[+][1-9][0-9]*$/)
        .withMessage('please include your country code.. e.g +2347012345678')

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

