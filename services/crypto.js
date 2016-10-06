/**
 * Created by sachinPc on 10/6/2016.
 */

var crypto = require('crypto');

options            = {};
options.saltlen    = 32;
options.iterations = 200;
options.keylen     = 512;
options.encoding   = 'base64';

exports.salt = function (cb) {
    crypto.randomBytes(options.saltlen, function (err, buf) {
        if (err) {
            cb(err, null);
        } else {
            cb(null, buf.toString(options.encoding));
        }
    });
};

exports.hash = function (password, salt, cb) {
    crypto.pbkdf2(password, salt, options.iterations, options.keylen, function (err,
                                                                                key) {
        if (err) {
            cb(err, null);
        } else {
            cb(null, key.toString(options.encoding));
        }
    });
};