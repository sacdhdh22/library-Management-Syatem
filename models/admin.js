
var mongoose =require('mongoose');
var Schema = mongoose.Schema;
var adminSchema = new Schema({
    fullname : String,
    number : Number,
    email: String,
    auth : {
        username: String,
        password : String,
        salt: String
    }

});


adminSchema.statics.usernameInUse = function (username, callback) {
    this.findOne({ 'auth.username' : username }, function (err, doc) {
        if (err) callback(err);
        else if (doc) callback(null, true);
        else callback(null, false);
    });
};
adminSchema.statics.findAdminByUsername = function (username, callback) {
    console.log(username);
    this.findOne({'auth.username': username }, function (err, doc) {

        if (err) callback(err);
        else if (doc) callback(null, doc);
        else callback(null);
    });
};

adminSchema.statics.EmailInUse = function (email, callback) {
    this.findOne({ email: email }, function (err, doc) {
        if (err) callback(err);
        else if (doc) callback(null, true);
        else callback(null, false);
    });
};
adminSchema.statics.NumberInUse = function (number, callback) {
    this.findOne({ number: number }, function (err, doc) {
        if (err) callback(err);
        else if (doc) callback(null, true);
        else callback(null, false);
    });
};

module.exports = mongoose.model('Admin', adminSchema);