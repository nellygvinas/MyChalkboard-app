const mongoose = require("mongoose");
const shortid = require('shortid');
const Schema = mongoose.Schema;


const classSchema =  new Schema({
  className: {
    type: String,
    required: true,
    minlength: 4
  },
  teacher: {
    teacherName: String,
    teacherId: {type: Schema.Types.ObjectId, ref: 'User'}},
  schoolName: {
    type: String
  },
  schoolId: {type: Schema.Types.ObjectId, ref: 'School'},
  classCode: {type: String, default: shortid.generate},
  creator: {type: Schema.Types.ObjectId, ref: 'User'},
  parents: [{type: Schema.Types.ObjectId, ref: 'User'}],
  }, 
  {timestamps: true});

  classSchema.methods.createClassCode = function(cb) {
    let nameForCode = this.model('School').find({ schoolName: this.schoolName }, cb);
    let cityForCode = this.model('School').find({ city: this.city }, cb);
    // let randomCodeNumber = 
  };

// "Class" model --> "Class" collection
const Class = mongoose.model("Class", classSchema);
module.exports = Class;