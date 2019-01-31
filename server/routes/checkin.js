const express = require('express');
const createError = require('http-errors');
const moment = require('moment');
const config = require('./../util/config');
const Entry = require('./../models/Entry');
const Student = require('./../models/Student');
const authRequired = require('./../util/authRequired');

const router = express.Router();

/* GET checkin form */
router.get('/:student_id', authRequired, (req, res) => {
  const { student_id } = req.params;
  Student.findOne({ _id: student_id }, (err, student) => {
    let section;
    const flags = {};

    function renderPage() {
      res.render('checkin', {
        course: config.get('course'),
        loc: process.env.CMULAB_LOC,
        student: req.params.student_id,
        section,
        radio: config.get('radioInput'),
        lab: config.get('manualLab'),
        minscore: Number.parseInt(config.get('minScore'), 10),
        maxscore: Number.parseInt(config.get('maxScore'), 10),
        flags,
      });
    }

    const now = Date.now();

    if (!err && student) {
      section = student.section;
      if (section) {
        if (config.get('flagSection')) {
          const sections = config.get('sections');
          const validRange = sections[section];
          if (validRange) {
            const validStart = moment(validRange.start).valueOf();
            const validEnd = moment(validRange.end).valueOf();
            if (now < validStart || now > validEnd) {
              flags.section = true;
            }
          }
        }
      } else if (config.get('flagGhosts')) {
        flags.ghost = true;
      }
    }

    const flagAttempts = config.get('flagAttempts');
    if (flagAttempts) {
      const today = moment().startOf('day').valueOf();
      Entry.find({
        student_id,
        date: { $gte: today },
      }).sort('date').exec((entryErr, entries) => {
        if (!entryErr && entries) {
          entries.filter(entry => entry.date > today).some((entry) => {
            const diff = now - entry.date;
            if (flagAttempts === 'time') {
              if (diff > config.get('flagAttemptsThreshold')) {
                flags.attempt = { diff, score: entry.score };
                return true;
              }
            } else if (flagAttempts === 'section') {
              const sections = config.get('sections');
              Object.values(sections).some((validRange) => {
                const validStart = moment(validRange.start).valueOf();
                const validEnd = moment(validRange.end).valueOf();
                if (validStart <= now && now <= validEnd) {
                  if (entry.date < validStart || entry.date > validEnd) {
                    flags.attempt = {
                      diff,
                      section: entry.section,
                      score: entry.score,
                    };
                  }
                  return true;
                }
                return false;
              });
            }
            return false;
          });
        }
        renderPage();
      });
    } else {
      renderPage();
    }
  });
});

/* POST checkin data */
router.post('/:student_id', authRequired, (req, res, next) => {
  const { section, score, flags } = req.body;
  if (!section || !score) {
    return next(createError(400, 'Provide section and score'));
  }
  if (score < config.get('minScore') || score > config.get('maxScore')) {
    return next(createError(400, 'Invalid score'));
  }

  let { student_id } = req.params;
  if (config.get('lowercaseStudents')) student_id = student_id.toLowerCase();

  const today = moment().startOf('day').valueOf();
  Entry.update({
    student_id,
    date: { $gte: today },
  }, {
    $set: { good: false },
  }, { multi: true }, (err) => {
    if (err) return next(createError(500, err));
    const options = {
      student_id,
      date: Date.now(),
      section: section.toUpperCase(),
      lab: config.get('manualLab') ? req.body.lab : null,
      score,
      ta: req.user._id,
    };
    if (flags) {
      options.flags = JSON.parse(flags);
      options.good = false;
    }
    Entry.create(options, (createErr) => {
      if (createErr) return next(createError(500, createErr));
      return res.redirect('/?success=check-in');
    });
  });
});

module.exports = router;
