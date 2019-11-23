const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postingSchema = new Schema({
    creation: Date,
    description: String,
    files: [{type: String}],
    class: {type: Schema.Types.ObjectId, ref: 'Class'},
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    comments: [{user: {type: Schema.Types.ObjectId, ref: 'User'}, comment: String}]
})

var autoPopulateUser = function(next) {
    this.populate('comments.user');
    next();
  };



  postingSchema.pre('findOne', autoPopulateUser);
  postingSchema.pre('find', autoPopulateUser);
  postingSchema.pre('findById', autoPopulateUser);


  const postingModel = mongoose.model('Posting', postingSchema)
//mongoose expects the name of the model to be singular and havea capital first letter
//name of the collection in DB will be called celebrities with lower case C because mongoose will do it by magic


module.exports = postingModel;