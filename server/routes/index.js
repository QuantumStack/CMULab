const express = require('express');
const config = require('./../util/config');

const router = express.Router();

/* GET home page */
router.get('/', (req, res) => {
  res.render('index', {
    course: config.get('course'),
    loc: process.env.CMULAB_LOC,
    success: req.query.success,
  });
});

module.exports = router;
