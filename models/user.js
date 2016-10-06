
var mongoose =require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    username:String,
    fullname : String,
    number : Number,
    email: String

});


userSchema.statics.usernameInUse = function (username, callback) {
    this.findOne({ username: username }, function (err, doc) {
        if (err) callback(err);
        else if (doc) callback(null, true);
        else callback(null, false);
    });
};

userSchema.statics.EmailInUse = function (email, callback) {
    this.findOne({ email: email }, function (err, doc) {
        if (err) callback(err);
        else if (doc) callback(null, true);
        else callback(null, false);
    });
};
userSchema.statics.NumberInUse = function (number, callback) {
    this.findOne({ number: number }, function (err, doc) {
        if (err) callback(err);
        else if (doc) callback(null, true);
        else callback(null, false);
    });
};
userSchema.statics.findByEmail = function (email, callback) {
    this.findOne({ email: email }, function (err, doc) {

        if (err) callback(err);
        else if (doc) callback(null, doc);
        else callback(err);
    });
};

module.exports = mongoose.model('User', userSchema);