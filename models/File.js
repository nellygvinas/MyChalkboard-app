const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fileSchema = new Schema({
    creation: Date,
    description: String,
    files: [{type: String}],
    class: {type: Schema.Types.ObjectId, ref: 'Class'},
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
})

const fileModel = mongoose.model('File', fileSchema)
//mongoose expects the name of the model to be singular and havea capital first letter
//name of the collection in DB will be called celebrities with lower case C because mongoose will do it by magic


module.exports = fileModel;