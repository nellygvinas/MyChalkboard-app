const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const schoolSchema =  new Schema({
  schoolName: {
    type: String,
    required: true,
    minlength: 4
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  zip: {
    type: String
  },
  // schoolCode: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   default: mongoose.Types.ObjectId
  // },
  creator: {type: Schema.Types.ObjectId, ref: 'User'}
  }, 
  {
  timestamps: true
  });

  schoolSchema.methods.createSchoolCode = function(cb) {
    let nameForCode = this.model('School').find({ schoolName: this.schoolName }, cb);
    let cityForCode = this.model('School').find({ city: this.city }, cb);
    // let randomCodeNumber = 
  };

// "School" model --> "Schools" collection
const School = mongoose.model("School", schoolSchema);
module.exports = School;

