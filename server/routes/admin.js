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

/* GET admin console -> lab */
router.get('/', adminRequired, (req, res) => {
  res.redirect('/admin/data');
});

/* GET view data */
function parseDataQuery(query) {
  const options = {};
  const { filters } = query;
  const { startDate, endDate, flags, good } = filters;
  if (startDate && endDate) {
    options.date = {
      $gte: new Date(startDate),
      $lt: new Date(endDate),
    };
    delete filters.startDate;
    delete filters.endDate;
  }
  if (flags) {
    options.flags = {
      $gt: {},
    };
    delete filters.flags;
  }
  if (good) {
    options.good = true;
    delete filters.good;
  }

  Object.entries(filters).forEach(([param, value]) => {
    if (value !== '') options[param] = value;
  });

  return [options, query.sort];
}
router.get('/data', adminRequired, (req, res, next) => {
  res.render('admin', {
    isData: true,
    isDataView: true,
    entries: [],
    success: req.query.success,
    ...appData(),
  });
});

/* GET manage users */
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

/* GET manage students */
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

/* GET edit config */
router.get('/config', adminRequired, (req, res, next) => {
  Student.count({}, (err, count) => {
    if (err) return next(createError(500, err));
    res.render('admin', {
      isConfig: true,
      config: config.all(),
      studentsCount: count,
      success: req.query.success,
      ...appData(),
    });
  });
});

/* POST raw data */
router.post('/rawdata', adminRequired, (req, res, next) => {
  const [options, sort] = parseDataQuery(req.body);
  Entry.find(options).sort(sort).exec((err, entries) => {
    if (err) return next(createError(500, err));
    res.send(entries);
  });
});

/* POST download CSV */
router.post('/getcsv', adminRequired, (req, res, next) => {
  const [options, sort] = parseDataQuery(req.body);
  Entry.find(options).sort(sort).exec((err, entries) => {
    if (err) return next(createError(500, err));
    res.setHeader('Content-Type', 'text/csv');
    res.write(json2csv(entries, {
      fields: [
        'section',
        'student_id',
        'score',
        'lab',
        'date',
        'ta',
        'flags',
        'good',
      ],
      defaultValue: '',
    }));
    return res.end();
  });
});

/* POST delete data */
router.post('/delete', adminRequired, (req, res, next) => {
  Entry.deleteMany(parseDataQuery(req.body)[0]).exec((err) => {
    if (err) return next(createError(500, err));
    return res.send(200);
  });
});

/* POST mark entry */
router.post('/togglegood', adminRequired, (req, res, next) => {
  const { _id, good } = req.body;
  if (!_id || good == null) {
    return next(createError(400, 'Provide _id and good'));
  }
  Entry.update({ _id }, { $set: { good } }, (err) => {
    if (err) return next(createError(500, err));
    return res.send(200);
  });
});

/* POST assign lab number */
router.post('/assignlab', adminRequired, (req, res, next) => {
  const { lab, preserve } = req.body;
  if (lab == null) return next(createError(400, 'Provide lab'));
  const options = parseDataQuery(req.body)[0];
  if (preserve) options.lab = null;
  Entry.updateMany(options, { lab }, (err) => {
    if (err) return next(createError(500, err));
    return res.send(200);
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
    const columns = Object.keys(json[0]);
    const desired = ['_id', 'section'];
    if (columns.toString() !== desired.toString()) {
      return next(createError(400, 'Bad CSV columns'));
    }

    function iterItems(i, err) {
      if (err) return next(createError(500, err));
      if (i === json.length) {
        return res.redirect('/admin/students?success=student+registration');
      }

      const item = json[i];
      Student.findOneAndUpdate({
        _id: item._id,
      }, item, { upsert: true }, (updateErr) => {
        const j = i + 1;
        if (updateErr) return iterItems(j, updateErr);
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

/* POST write config */
router.post('/writeconfig', adminRequired, (req, res, next) => {
  const newConfig = Object.entries(req.body);
  function iterItems(i, err) {
    if (err) return next(createError(500, err));
    if (i === newConfig.length) {
      return res.redirect('/admin/config?success=settings+change');
    }

    const [key, value] = newConfig[i];

    try {
      let v = value;
      const type = typeof config.get(key);
      if (type === 'number') v = Number.parseInt(v, 10);
      else if (type === 'boolean') v = typeof v === 'object';

      if (key === 'flagAttempts') v = v.length === 3 ? v[2] : '';
      if (key === 'sections') {
        if (value) {
          csv2json().fromString(value).then((json) => {
            const columns = Object.keys(json[0]);
            const desired = [
              'section',
              'start_hour',
              'start_minute',
              'end_hour',
              'end_minute',
            ];
            if (columns.toString() !== desired.toString()) {
              return iterItems(null, new Error('Bad CSV columns'));
            }

            v = {};
            json.forEach((item) => {
              v[item.section] = item;
              delete v[item.section].section;
            });
            config.write(key, v);
            iterItems(i + 1);
          });
        } else {
          iterItems(i + 1);
        }
      } else {
        config.write(key, v);
        iterItems(i + 1);
      }
      return false;
    } catch (newErr) {
      iterItems(i + 1, newErr);
    }
  }
  iterItems(0);
});

module.exports = router;
