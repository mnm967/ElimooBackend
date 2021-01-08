//TODO Implement Segment/Mixpanel

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

//mongoose.connect("mongodb://localhost/elimoo", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect("mongodb+srv://elimooDBUser:elimooDB123@cluster0-z5xos.mongodb.net/elimoo?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;

if(!db)
    console.log("Error Connecting Database");
else
    console.log("Database Connected Successfully");

Sentry.init({ dsn: 'https://64831afb121749eb9b5356e70c54feba@o405222.ingest.sentry.io/5270515' });

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
    var test = {};
    test['uname'] = 'CaptainMarvelSJW';
    test['fname'] = 'Carol Susan Jane Danvers';

    res.json({
        status: "API is Running Successfully",
        site: req.protocol + '://' + req.get('host')
    });
});

app.use(Sentry.Handlers.errorHandler());

app.listen(port, function () {
    console.log("Running Elimoo on port: " + port);
});