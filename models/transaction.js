
var mongoose =require('mongoose');
var Schema = mongoose.Schema;
var transactionSchema = new Schema({
    user : { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now() },
    book : { type: Schema.Types.ObjectId, ref: 'Book' },
    status: {type : Number, default: 0}
});

transactionSchema.statics.getAllTrasaction = function(callback) {
    this.find()
        .populate('user')
        .populate('book')
        .sort({'date':-1})

        .exec(function (err, doc){
        if (err) callback(err);
        else if (doc) callback(null, doc);
        else callback(null, false);
    });
};


module.exports = mongoose.model('Trans', transactionSchema);