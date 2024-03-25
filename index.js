const express = require('express');
const apiRoutes = require("./api-routes");
const adminRoutes = require("./admin-routes");
const userRoutes = require("./user-routes");

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const fileUpload = require('express-fileupload');

const Sentry = require('@sentry/node');

const app = express();
const port = process.env.PORT || 9999;
const db_url = process.env.MONGODB_URI;

mongoose.connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;

if(!db)
    console.log("Error Connecting Database");
else
    console.log("Database Connected Successfully");

Sentry.init({ dsn: process.env.SENTRY_DSN });

app.use(Sentry.Handlers.requestHandler());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

 app.use(fileUpload({
     createParentPath: true
 }));

app.use('/uploads', express.static('uploads'));

app.use('/api', apiRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    res.json({
        status: "API is Running Successfully",
        site: req.protocol + '://' + req.get('host')
    });
});

app.use(Sentry.Handlers.errorHandler());

app.listen(port, function () {
    console.log("Running Elimoo on port: " + port);
});
