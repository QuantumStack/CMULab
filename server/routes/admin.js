const express = require('express');
const createError = require('http-errors');
const json2csv = require('json2csv').parse;
const csv2json = require('csvtojson');
const moment = require('moment');
const config = require('./../util/config');
const helpers = require('./../util/helpers');
const User = require('./../models/User');
const Entry = require('./../models/Entry');
const Student = require('./../models/Student');
const adminRequired = require('./../util/adminRequired');
const version = require('./../util/version');

const router = express.Router();

// require admin authorization for everything at /admin
router.use(adminRequired);

// returns an object with the course, hosting location, and version
function appData() {
  return {
    course: config.get('course'),
    loc: process.env.CMULAB_LOC,
    version: version(),
  };
}

/* GET admin console -> data */
router.get('/', (req, res) => {
  res.redirect('/admin/data');
});

// parse a query from the data page
function parseDataQuery(query) {
  const options = {};
  const { filters } = query;
  const {
    startDate, endDate, flags, good,
  } = filters;
  // special case: start and end date must be used together
  if (startDate && endDate) {
    // set mongo query options for date range
    options.date = {
      $gte: new Date(startDate),
      $lt: new Date(endDate),
    };
    // delete start and end date from filters object
    delete filters.startDate;
    delete filters.endDate;
  }
  // special case: flags or not
  if (flags) {
    // set mongo query option for empty flags object
    options.flags = {
      $gt: {},
    };
    // delete flags from filters object
    delete filters.flags;
  }

  // for each filter, set its value in options
  Object.entries(filters).forEach(([param, value]) => {
    if (value !== '') options[param] = value;
  });

  // return filter options and extracted sort from query
  return [options, query.sort];
}

/* GET data */
router.get('/data', (req, res) => {
  res.render('admin', {
    isData: true,
    success: req.query.success,
    ...appData(),
  });
});

/* GET manage users */
router.get('/users', (req, res, next) => {
  // query all users and sort by _id
  User.find().sort('_id').exec((err, users) => {
    if (err) return next(createError(500, err));
    // render page with queried data
    res.render('admin', {
      isPeople: true,
      users,
      success: req.query.success,
      ...appData(),
    });
  });
});

/* GET manage students */
router.get('/students', (req, res, next) => {
  // query students with average score and list of section, sort by _id
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
    // render page with queried data
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
router.get('/config', (req, res, next) => {
  // count students
  Student.count({}, (err, count) => {
    if (err) return next(createError(500, err));
    // render page with all configs and queried count
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
router.post('/rawdata', (req, res, next) => {
  // parse data query
  const [options, sort] = parseDataQuery(req.body);
  // query entries given filters and sort
  Entry.find(options).sort(sort).exec((err, entries) => {
    if (err) return next(createError(500, err));
    // send data after some modifications
    res.send(entries.map((entry) => {
      // convert each entry to json to get rid of helper functions
      const newEntry = entry.toJSON();
      // prettify date
      newEntry.date = helpers.prettyDate(entry.date);
      // if entry has attempt flag, prettify the time interval
      if (newEntry.flags && newEntry.flags.attemptDiff) {
        newEntry.flags.attemptDiff = helpers.prettyDiff(newEntry.flags.attemptDiff);
      }
      return newEntry;
    }));
  });
});

/* POST download CSV */
router.post('/getcsv', (req, res, next) => {
  // parse data query
  const [options, sort] = parseDataQuery(req.body);
  // query entries given filters and sort
  Entry.find(options).sort(sort).exec((err, entries) => {
    if (err) return next(createError(500, err));
    // send data
    res.setHeader('Content-Type', 'text/csv');
    // convert json to csv
    res.write(json2csv(entries, {
      fields: [
        'student_id',
        'section',
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
router.post('/delete', (req, res, next) => {
  // parse query and delete entries
  Entry.deleteMany(parseDataQuery(req.body)[0]).exec((err) => {
    if (err) return next(createError(500, err));
    return res.send(200);
  });
});

/* POST mark entry */
router.post('/togglegood', (req, res, next) => {
  const { _id, good } = req.body;
  if (!_id || good == null) {
    return next(createError(400, 'Provide _id and good'));
  }
  // query entry with given _id and set good to given value
  Entry.update({ _id }, { $set: { good } }, (err) => {
    if (err) return next(createError(500, err));
    return res.send(200);
  });
});

/* POST assign lab number */
router.post('/assignlab', (req, res, next) => {
  const { lab, preserve } = req.body;
  if (lab == null) return next(createError(400, 'Provide lab'));
  // parse data query
  const options = parseDataQuery(req.body)[0];
  // if preserve, only ask for entries with no lab already assigned
  if (preserve) options.lab = null;
  // query entries given filters and set lab to given value
  Entry.updateMany(options, { lab }, (err) => {
    if (err) return next(createError(500, err));
    return res.send(200);
  });
});

/* POST add user */
router.post('/adduser', (req, res, next) => {
  const { student_id, admin } = req.body;
  if (!student_id) return next(createError(400, 'Provide student_id'));
  // query users for student_id given to make sure it doesn't already exist
  User.findOne({ _id: student_id }, (err, user) => {
    if (err) return next(createError(500, err));
    if (user) return next(createError(400, 'User already exists'));
    // create new user with given _id and admin option
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
router.post('/removeuser', (req, res, next) => {
  const { student_id } = req.body;
  if (!student_id) return next(createError(400, 'Provide student_id'));
  // make sure admin is not deleting themselves
  if (student_id === req.user._id) {
    return next(createError(400, 'Delete yourself?'));
  }
  // query user with given _id and delete it
  User.remove({ _id: student_id }, (err) => {
    if (err) return next(createError(500, err));
    return res.redirect('/admin/users?success=user+delete');
  });
});

/* POST enroll students */
router.post('/enrollstudents', (req, res, next) => {
  if (!req.body.data) return next(createError(400, 'Provide CSV file'));
  // parse csv file of students and section
  csv2json().fromString(req.body.data).then((json) => {
    const columns = Object.keys(json[0]);
    // make sure csv has correct header
    const desired = ['_id', 'section'];
    if (columns.toString() !== desired.toString()) {
      return next(createError(400, 'Bad CSV columns'));
    }

    // recursively loop through rows and insert into db
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
        return iterItems(j);
      });
    }
    iterItems(0);
  }).catch(err => next(createError(400, err)));
});

/* POST remove all students */
router.post('/removestudents', (req, res, next) => {
  // query all students and delete them
  Student.deleteMany({}).exec((err) => {
    if (err) return next(createError(500, err));
    return res.redirect('/admin/students?success=student+registration+delete');
  });
});

/* POST write config */
router.post('/writeconfig', (req, res, next) => {
  const newConfig = Object.entries(req.body);
  // recursively loop through config form and update
  function iterItems(i, err) {
    if (err) return next(createError(500, err));
    if (i === newConfig.length) {
      // save final config to disk
      config.save((saveErr) => {
        if (saveErr) iterItems(null, saveErr);
        return res.redirect('/admin/config?success=settings+change');
      });
      return;
    }

    // extract key-value pair
    const [key, value] = newConfig[i];

    // try to parse and write the config value
    try {
      let v = value;
      const type = typeof config.get(key);
      // for flagAttemptsThreshold, parse time interval using moment
      if (key === 'flagAttemptsThreshold') {
        const [number, units] = v.split(' ');
        v = moment.duration(Number.parseInt(number, 10), units).asMilliseconds();
      // for other numerical fields, convert string to int
      } else if (type === 'number') v = Number.parseInt(v, 10);
      // for boolean fields, convert checkbox object to bool
      else if (type === 'boolean') v = typeof v === 'object';
      // for flagAttempts, convert checkbox + selection to string
      if (key === 'flagAttempts') v = v.length === 3 ? v[2] : '';

      // for sections data, parse csv file
      if (key === 'sections') {
        if (value) {
          // convert csv to json
          csv2json().fromString(value).then((json) => {
            const columns = Object.keys(json[0]);
            // make sure csv has correct header
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
            // loop through rows and convert them to section time objects
            json.forEach((item) => {
              v[item.section] = item;
              delete v[item.section].section;
            });
            // write section data as json object in configs
            config.write(key, v);
            iterItems(i + 1);
          });
        } else {
          iterItems(i + 1);
        }
      } else {
        // write key-value and proceed
        config.write(key, v);
        iterItems(i + 1);
      }
      return false;
    // in case of error...
    } catch (newErr) {
      iterItems(i + 1, newErr);
    }
  }
  iterItems(0);
});

module.exports = router;
