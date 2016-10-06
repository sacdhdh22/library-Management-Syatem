/**
 * Created by sachinPc on 10/6/2016.
 */
var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var path = require('path');
var User = require('../models/user');
var crypto =  require('../services/crypto');
var async = require('async');
var Admin = require('../models/admin');
var Book = require('../models/books');
var Trans = require('../models/transaction');

router.post('/signup', signup);
router.post('/addBooks', addBooks);
router.post('/login', login);
router.post('/allocate', allocate);
router.post('/checkUser', checkUser);
router.post('/transaction', transaction);
router.get('/getTranactions', getTranactions);
router.get('/getBook', getBook);
router.get('/changeStatus/:id', changeStatus);


router.get('/login',function(req, res){
    res.render('admin/loginAdmin');
});

router.get('/adminManage',function(req, res){
    res.render('admin/adminManage');
});

router.get('/loginPls',function(req, res){
    res.render('admin/loginPls')
});

router.get('/bookDelivery',function(req, res){
    res.render('admin/bookDelivery')
});

router.get('/errorMsg',function(req, res){
    res.render('admin/errorMsg')
});

router.get('/addbooks',function(req, res){
    res.render('admin/addbooks')
});

router.get('/checkUser',function(req, res){
    res.render('admin/checkUser')
});

router.get('/viewTodaysSummary',function(req, res){
    res.render('admin/errorMsg')
});

router.get('/allocate',function(req, res){
    res.render('admin/allocate')
});

function login(req, res, next){
    async.waterfall([
        function(callback){
            callback(null, req.body);
        },
        getAdmin,
        getHash,
        authenticate
    ],function(err, data){
        if (err) {
            res.redirect('/admin/errorMsg');
        }
        else {
            req.session.admin = data.admin;
            console.log(req.session);
            res.redirect('/admin/adminManage');

        }
    })
}

getAdmin = function(data, callback){
 Admin.findAdminByUsername(data.enterusername, function(err, doc){
     if(err)
         callback( new Error(messages.invalidPassword));
     else if(doc){

         data.admin = doc;
         callback(null, data);
     }
     else if(!doc)
         callback( new Error(messages.invalidPassword));
 })
}

getHash = function(data, callback){
 crypto.hash(data.password, data.admin.auth.salt,  function(err, hash){
     if(err)
     callback(err);
     else {
         data.hash = hash;
         callback(null, data);
     }
 })
}
authenticate = function(data, callback) {
    if (data.admin.auth.password == data.hash)
        callback(null, data);
    else {
           callback( new Error(messages.invalidPassword));
    }
}

function signup(req, res, next) {
    async.waterfall([
            function (callback) {
                callback(null, req.body.admin);
            },
            checkUniqueStuffs,
            saveAdmin

        ],
        function (err, data) {
            if (err) {
                res.status(406).json({ err : err});
            }
            else {
                res.json({data: data});
            }
        });

};

checkUniqueStuffs = function (data, callback) {
    async.parallel({
            usernameInUse: function (callback) {
                Admin.usernameInUse(data.username, function (err, result) {
                    if (err) {

                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            },
            emailInUse: function (callback) {
                Admin.EmailInUse(data.email, function (err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            },
            NumberInUse: function (callback) {
                Admin.NumberInUse(data.number, function (err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            }
        },
        function (err, results) {
            if (err) {
                console.log(err);
                callback(err);
            } else if (results.usernameInUse) {
                console.log(err);
                callback(messages.usernameInUse);
            } else if (results.emailInUse) {
                callback(messages.emailInUse);
            } else if (results.mobileInUse) {
                callback(messages.phonenumberInUse);
            }
            else {
                callback(null, data);
            }
        });
}

saveAdmin =function(data, callback){
    var adminData = new Admin();
    async.series([
        function(callback){
            adminData.fullname = data.fullname;
            adminData.email = data.email;
            adminData.number = data.number;
            adminData.auth.username = data.username;
            callback(null);
        },
        function(callback){
            crypto.salt(function(err, salt){
             if(err)
             callback(err);
             else
                 adminData.auth.salt = salt;
                callback(null);
            });
        }, function(callback){
            crypto.hash(data.password, adminData.auth.salt, function(err, hash){
                if(err)
                    callback(err);
                else
                    adminData.auth.password = hash;
                callback(null);
            });
        },function(save){
            Admin.create(adminData, function(err, result){
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            })
        }], function(err, results){
        if(err)
        callback(err);
        else
        callback(null, data);
    })
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


function addBooks(req, res, next){

    var book = new Book();
    book.name = req.body.book.name;
    book.author = req.body.book.author;
    console.log(book);
    Book.create(book, function(err, doc){
        if(err)
        res.sendStatus(500);
        else
        res.sendStatus(200);
    })


}
function checkUser(req, res, next){

    User.findByEmail(req.body.email, function(err, doc){
        console.log(doc);
        if(err)
        res.sendStatus(500);
        else if(!doc)
            res.sendStatus(500);
        else
        res.send(doc);
    })


}

function allocate(req, res, next){
    var book = new Book();
    book.name = req.body.book.name;
    book.author = req.body.book.author;
    console.log(book);
    Book.create(book, function(err, doc){
        if(err)
        res.sendStatus(500);
        else
        res.sendStatus(200);
    })
}

function getBook(req, res, next){
    Book.getBook(function(err, doc){
        if(err)
        res.sendStatus(500);
        else if(!doc)
        res.sendStatus(500);
        else
        res.send(doc);
    })
}

function transaction(req, res, next){
    var transaction = new Trans();
    transaction.user= req.body.userId;
    transaction.book= req.body.bookId;
    transaction.status= 1;
    Trans.create(transaction,function(err, doc){
        if(err)
        res.sendStatus(500);
        else if(!doc)
        res.sendStatus(500);
        else
        res.send(doc);
    })
}

function getTranactions(req, res, next){
    Trans.getAllTrasaction(function(err, doc){
        if(err)
        res.sendStatus(500);
        else if(!doc)
        res.sendStatus(500);
        else
        res.send(doc);
    });
}

function changeStatus(req, res, next){

    Book.findByIdAndUpdate(req.params.id,
        {
            $set: { status: 1 }
        }, {new:true}
        , function (err, doc) {
            console.log(doc);
            if (err) res.sendStatus(500);
            else res.send(doc);
        }
    );
}

var messages = {
    usernameInUse: 'Username is already in use',
    phonenumberInUse: 'Mobile number is already in use',
    emailInUse: 'Email is already in use',
    errorSavingdata: 'error Saving data',
    invalidPassword: 'error Saving data'
};

module.exports = router;