
var mongoose =require('mongoose');
var Schema = mongoose.Schema;
var bookSchema = new Schema({
    name : String,
    author : String,
    status: {type : Number, default: 0}
});

bookSchema.statics.getBook = function (callback) {
    this.find(function (err, doc) {
        if (err) callback(err);
        else if (doc) callback(null, doc);
        else callback(null, false);
    });
};

module.exports = mongoose.model('Book', bookSchema);