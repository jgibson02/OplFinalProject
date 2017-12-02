var mongoose = require('mongoose');

var CourseInterestSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
    trim: true
  },
  courseNumber: {
    type: Number,
    required: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  comments: {
    type: String,
    required: false,
    trim: true
  }
});

// Function to authenticate input against database
CourseInterestSchema.statics.findInterests = function (department, courseNumber, callback) {
  var foundInterests = [];
  CourseInterest.find({ department: department, courseNumber: courseNumber }, 'firstName lastName', function (err, courseInterest) {
    if (err) {
      return callback(err);
    } else if (!courseInterest) {
      return;
    } else {
      foundInterests.push(courseInterest);
    }
  });
  callback(foundInterests);
}

var CourseInterest = mongoose.model('CourseInterest', CourseInterestSchema);
module.exports = CourseInterest;