const express = require('express');
const createError = require('http-errors');
const Entry = require('./../models/Entry');
const authRequired = require('./../util/authRequired');

const router = express.Router();

/* GET checkin form */
router.get('/:student_id', authRequired, (req, res) => {
  res.render('checkin', {
    course: process.env.CMULAB_COURSE,
    loc: process.env.CMULAB_LOC,
    student: req.params.student_id,
    maxscore: Number.parseInt(process.env.CMULAB_MAXSCORE, 10),
  });
});

/* POST checkin data */
router.post('/:student_id', authRequired, (req, res, next) => {
  Entry.create({
    student_id: req.params.student_id,
    date: Date.now(),
    section: req.body.section.toUpperCase(),
    score: req.body.score,
    ta: req.user._id,
  }, (err) => {
    if (err) return next(createError(500, err));
    return res.redirect('/success');
  });
});

module.exports = router;
