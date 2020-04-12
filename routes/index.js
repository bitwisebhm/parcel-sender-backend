const express = require ('express');
const usersRoute = require ('./users-routes');
const parcelRoute = require ('./parcel-routes');

const app = express();

app.use('/', usersRoute);
app.use('/', parcelRoute);

module.exports = app;