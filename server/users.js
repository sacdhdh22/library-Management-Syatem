/**
 * Created by sachinPc on 10/6/2016.
 */
var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var User = require('../models/user');
var Index = require('./index.js');
var mongoose = require('mongoose');

router.get('/success', function(req, res, next) {
    res.render('admin/managementPage/management');
});

router.post('/signup', function(req, res, next){
    var user;
    checkUsername(req.body.user.username)
        .then(function () {
            return EmailInUse(req.body.user.email);
        }).then(function(){
            return NumberInUse(req.body.user.number);
        }).then (function(){
        return save(req.body.user);
    }).then(function(data){
            res.send(data);
        })
        .catch(OperationalError, onOperationalError)
        .catch(onError);

    function onOperationalError(err) {

        res.status(500).send({error: err});
    }

    function onError(err) {

        res.status(500).send({error: err});
    }

});

function OperationalError(message, cause) {
    this.message = message;
    this.name = this.constructor.name;
    this.cause = cause;
}

OperationalError.prototype = Object.create(Error.prototype);
OperationalError.prototype.constructor = OperationalError;

function checkUsername(username) {
    return new Promise(function (resolve, reject) {
        User.usernameInUse(username, function (err, inUse) {
            if (err) reject(new OperationalError(messages.internalError, err));
            else if (inUse) reject(new OperationalError(messages.usernameInUse));
            else resolve();
        });
    });
}
function EmailInUse(email) {
    return new Promise(function (resolve, reject) {
        User.usernameInUse(email, function (err, inUse) {
            if (err) reject(new OperationalError(messages.internalError, err));
            else if (inUse) reject(new OperationalError(messages.emailInUse));
            else resolve();
        });
    });
}
function NumberInUse(number) {
    return new Promise(function (resolve, reject) {
        User.NumberInUse(number, function (err, inUse) {
            if (err) reject(new OperationalError(messages.internalError, err));
            else if (inUse) reject(new OperationalError(messages.phonenumberInUse));
            else resolve();
        });
    });
}
function save(user) {
    return new Promise(function (resolve, reject) {
        var userData;
        userData = new User();
        userData.fullname = user.fullname;
        userData.email = user.email;
        userData.number = user.number;
        userData.username = user.username;
        User.create(userData, function(err, data){
            if (err) reject(new OperationalError(messages.internalError, err));
            else resolve(data);
        });
    });
}

var messages = {
    usernameInUse: 'Username is already in use',
    phonenumberInUse: 'Phone Number is not valid',
    emailInUse: 'Email is already in use',
    mobInUse: 'Mobile number is already in use'
};



module.exports = router;