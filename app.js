/**
 * Created by sachinPc on 10/5/2016.
 */
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var session      = require('express-session');
var MongoStore   = require('connect-mongo')(session);
var routes = require('./server');

// connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/library');

//setting up the view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'controller_frontEnd')));
app.use(require('express-session')({
    secret           : 'keyboard cat',
    resave           : false,
    saveUninitialized: false,
    store            : new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl               : 30 * 60
    })
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



app.use('/', routes);

app.listen(3000);

module.exports = app;