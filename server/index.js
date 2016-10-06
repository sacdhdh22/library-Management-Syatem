/**
 * Created by sachinPc on 10/5/2016.
 */
var express = require('express');
var router = express.Router();
var users = require('./users.js');
var path = require('path');
var admins = require('./admin.js');
router.use('/users', users);
router.use('/admin', admins);

router.get('/managementPage',  function(req, res, next){
      res.render('admin/managementPage/management');
})
router.get('/userPage', function(req, res, next){
    res.render('users/userHome');
});

router.get('/signUp', function(req, res, next){
    res.render('users/signup');
});

router.get('/adminHome', function(req, res, next){
    res.render('admin/adminHomePage');
});
router.get('/adminPage', function(req, res, next){
    res.render('admin/adminHomePage');
});
module.exports = router;