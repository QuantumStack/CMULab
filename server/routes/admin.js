const express = require('express');
const createError = require('http-errors');
const json2csv = require('json2csv').parse;
const csv2json = require('csvtojson');
const config = require('./../util/config');
const User = require('./../models/User');
const Entry = require('./../models/Entry');
const Student = require('./../models/Student');
const adminRequired = require('./../util/adminRequired');
const version = require('./../util/version');

const router = express.Router();

function appData() {
  return {
    course: config.get('course'),
    loc: process.env.CMULAB_LOC,
    version: version(),
  };
}

/* GET admin console */
router.get('/', adminRequired, (req, res) => {
  res.redirect('/admin/lab');
});

router.get('/lab', adminRequired, (req, res) => {
  res.render('admin', {
    isLab: true,
    success: req.query.success,
    ...appData(),
  });
});

router.get('/data', adminRequired, (req, res) => {
  res.render('admin', {
    isData: true,
    success: req.query.success,
    ...appData(),
  });
});

router.get('/delete', adminRequired, (req, res) => {
  res.render('admin', {
    isData: true,
    isDataDelete: true,
    success: req.query.success,
    ...appData(),
  });
});

router.get('/users', adminRequired, (req, res, next) => {
  User.find().sort('_id').exec((err, users) => {
    if (err) return next(createError(500, err));
    res.render('admin', {
      isPeople: true,
      users,
      success: req.query.success,
      ...appData(),
    });
  });
});

router.get('/students', adminRequired, (req, res, next) => {
  Entry.aggregate([{
    $group: {
      _id: '$student_id',
      section: {
        $push: '$section',
      },
      avgscore: {
        $avg: '$score',
      },
    },
  }]).sort('_id').exec((err, students) => {
    if (err) return next(createError(500, err));
    res.render('admin', {
      isPeople: true,
      isPeopleStudents: true,
      students,
      success: req.query.success,
      ...appData(),
    });
  });
});

/* GET data */
function filterData(query) {
  const options = {};
  const { startDate, endDate } = query;
  if (startDate && endDate) {
    options.date = {
      $gte: new Date(startDate),
      $lt: new Date(endDate),
    };
    delete query.startDate;
    delete query.endDate;
  }

  Object.entries(query).forEach(([param, value]) => {
    if (value !== '') options[param] = value;
  });

  return options;
}

router.get('/viewdata', adminRequired, (req, res, next) => {
  Entry.find(filterData(req.query)).sort({ date: -1 }).exec((err, entries) => {
    if (err) return next(createError(500, err));
    res.render('admin', {
      isData: true,
      isDataView: true,
      entries,
      success: req.query.success,
      ...appData(),
    });
  });
});

router.get('/getcsv', adminRequired, (req, res, next) => {
  Entry.find(filterData(req.query)).sort({ date: -1 }).exec((err, entries) => {
    if (err) return next(createError(500, err));
    res.setHeader('Content-Type', 'text/csv');
    res.write(json2csv(entries, {
      fields: ['student_id', 'date', 'lab', 'section', 'score', 'ta'],
      defaultValue: '',
    }));
    return res.end();
  });
});

/* POST delete data */
router.post('/delete', adminRequired, (req, res, next) => {
  Entry.deleteMany(filterData(req.body)).exec((err) => {
    if (err) return next(createError(500, err));
    return res.redirect('/admin/delete?success=delete');
  });
});


/* POST assign lab number */
router.post('/assignlab', adminRequired, (req, res, next) => {
  const { startDate, endDate, lab } = req.body;
  if (!startDate || !endDate || lab === null) {
    return next(createError(400, 'Provide startDate, endDate, lab'));
  }
  Entry.updateMany({
    date: {
      $gte: new Date(startDate),
      $lt: new Date(endDate),
    },
  }, {
    lab,
  }, (err) => {
    if (err) return next(createError(500, err));
    return res.redirect('/admin/lab?success=lab+assign');
  });
});

/* POST add user */
router.post('/adduser', adminRequired, (req, res, next) => {
  const { student_id, admin } = req.body;
  if (!student_id) return next(createError(400, 'Provide student_id'));
  User.findOne({ _id: student_id }, (err, user) => {
    if (err) return next(createError(500, err));
    if (user) return next(createError(400, 'User already exists'));
    User.create({
      _id: student_id,
      admin: admin === 'on',
    }, (saveErr) => {
      if (saveErr) return next(createError(500, saveErr));
      return res.redirect('/admin/users?success=user+add');
    });
  });
});

/* POST remove current user */
router.post('/removeuser', adminRequired, (req, res, next) => {
  const { student_id } = req.body;
  if (!student_id) return next(createError(400, 'Provide student_id'));
  if (student_id === req.user._id) {
    return next(createError(400, 'Delete yourself?'));
  }
  User.remove({ _id: student_id }, (err) => {
    if (err) return next(createError(500, err));
    return res.redirect('/admin/users?success=user+delete');
  });
});

/* POST enroll students */
router.post('/enrollstudents', adminRequired, (req, res, next) => {
  csv2json().fromString(req.body.data).then((json) => {
    function iterItems(i, err) {
      if (err) return next(createError(500, err));
      if (i === json.length) {
        return res.redirect('/admin/students?success=student+registration');
      }

      const item = json[i];
      Student.findOneAndUpdate({
        _id: item._id,
      }, item, { upsert: true }, (updateErr) => {
        i += 1;
        if (updateErr) return iterItems(i, updateErr);
        return iterItems(i);
      });
    }
    iterItems(0);
  }).catch(err => next(createError(400, err)));
});

/* POST remove all students */
router.post('/removestudents', adminRequired, (req, res, next) => {
  Student.deleteMany({}).exec((err) => {
    if (err) return next(createError(500, err));
    return res.redirect('/admin/students?success=student+registration+delete');
  });
});

module.exports = router;
