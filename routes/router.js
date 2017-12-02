var express = require('express');
var router = express.Router();
var User = require('../models/user');
var CourseInterest = require('../models/course-interest');
var path = require('path');

// GET route for landing page
router.get('/', function (req, res, next) {
  console.log("GET: /")
  return res.sendFile(path.join(__dirname + '/prod/index.html'));
});


// POST route for authentication
router.post('/api/authenticate', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.huskyId &&
    req.body.firstName &&
    req.body.lastName &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      huskyId: req.body.huskyId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/classes');
      }
    });

  } else if (req.body.logHuskyId && req.body.logPassword) {
    User.authenticate(req.body.logHuskyId, req.body.logPassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong HuskyID or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/classes');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

// GET route for retrieving users' course interests
router.get('/api/getCourseInterests', function (req, res, next) {
  CourseInterest.find({}, function(error, courseInterest) {
    if (error)
      return next(error)
  }).exec().then(function(arrayOfCourseInterests) {
    res.json({courseInterests: arrayOfCourseInterests});
  });
  
});

// POST route for recording interest in a course in the DB
router.post('/api/createCourseInterest', function (req, res, next) {
  console.log(JSON.stringify(req.body, null, 4));
  if (req.body.firstName && req.body.lastName && req.body.department && req.body.courseNumber) {
    var courseInterestData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      department: req.body.department,
      courseNumber: req.body.courseNumber,
      comments: req.body.comments
    }
    console.log("New interest POSTED:");
    console.log(courseInterestData);

    CourseInterest.create(courseInterestData, function (error, courseInterest) {
      if (error) {
        return next(error);
      }
    });
  }
  res.end();
});

// GET route after authenticating
router.get('/classes', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          return res.sendFile('classes.html', {root: 'prod'});
        }
      }
    });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;