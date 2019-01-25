const express = require('express');
const createError = require('http-errors');
const Entry = require('./../models/Entry');
const Student = require('./../models/Student');
const authRequired = require('./../util/authRequired');

const router = express.Router();

/* GET checkin form */
router.get('/:student_id', authRequired, (req, res) => {
  const { student_id } = req.params;
  Student.findOne({ _id: student_id }, (err, student) => {
    let section;
    if (!err && student) section = student.section;
    res.render('checkin', {
      course: process.env.CMULAB_COURSE,
      loc: process.env.CMULAB_LOC,
      student: req.params.student_id,
      section,
      radio: process.env.CMULAB_RADIOINPUT,
      lab: process.env.CMULAB_MANUALLAB,
      maxscore: Number.parseInt(process.env.CMULAB_MAXSCORE, 10),
    });
  });
});

/* POST checkin data */
router.post('/:student_id', authRequired, (req, res, next) => {
  const { section, score } = req.body;
  if (!section || !score) {
    return next(createError(400, 'Provide section and score'));
  }
  Entry.create({
    student_id: req.params.student_id,
    date: Date.now(),
    section: section.toUpperCase(),
    lab: process.env.CMULAB_MANUALLAB ? req.body.lab : null,
    score,
    ta: req.user._id,
  }, (err) => {
    if (err) return next(createError(500, err));
    return res.redirect('/success');
  });
});

module.exports = router;
