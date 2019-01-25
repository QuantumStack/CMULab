const express = require('express');
const createError = require('http-errors');
const json2csv = require('json2csv').parse;
const User = require('./../models/User');
const Entry = require('./../models/Entry');
const adminRequired = require('./../util/adminRequired');
const version = require('./../util/version');

const router = express.Router();

/* GET admin console */
router.get('/', adminRequired, (req, res) => {
  res.redirect('/admin/lab');
});

router.get('/lab', adminRequired, (req, res) => {
  res.render('admin', {
    course: process.env.CMULAB_COURSE,
    loc: process.env.CMULAB_LOC,
    isLab: true,
    version: version(),
  });
});

router.get('/data', adminRequired, (req, res) => {
  res.render('admin', {
    course: process.env.CMULAB_COURSE,
    loc: process.env.CMULAB_LOC,
    isData: true,
    version: version(),
  });
});

router.get('/delete', adminRequired, (req, res) => {
  res.render('admin', {
    course: process.env.CMULAB_COURSE,
    loc: process.env.CMULAB_LOC,
    isDelete: true,
    version: version(),
  });
});

router.get('/users', adminRequired, (req, res, next) => {
  User.find().sort('_id').exec((err, users) => {
    if (err) return next(createError(500, err));
    res.render('admin', {
      course: process.env.CMULAB_COURSE,
      loc: process.env.CMULAB_LOC,
      isUsers: true,
      users,
      version: version(),
    });
  });
});

/* GET data */
router.get('/getdata', adminRequired, (req, res, next) => {
  const options = {};
  const { startDate, endDate } = req.query;
  if (startDate && endDate) {
    options.date = {
      $gte: new Date(startDate),
      $lt: new Date(endDate),
    };
    delete req.query.startDate;
    delete req.query.endDate;
  }

  Object.entries(req.query).forEach(([param, value]) => {
    if (value !== '') options[param] = value;
  });

  Entry.find(options).sort('date').exec((err, entries) => {
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
  const options = {};
  const { startDate, endDate } = req.body;
  if (startDate && endDate) {
    options.date = {
      $gte: new Date(startDate),
      $lt: new Date(endDate),
    };
  }
  Entry.deleteMany(options).exec((err) => {
    if (err) return next(createError(500, err));
    return res.redirect('/admin/delete');
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
    return res.redirect('/admin/lab');
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
      return res.redirect('/admin/users');
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
    return res.redirect('/admin/users');
  });
});

module.exports = router;
