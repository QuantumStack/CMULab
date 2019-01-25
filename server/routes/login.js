const express = require('express');
const passport = require('passport');

const router = express.Router();

/* GET auth routes */
router.get('/',
  (req, res, next) => {
    if (req.query.return) {
      req.session.oauth2return = req.query.return;
    }
    next();
  },
  passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/callback',
  passport.authenticate('google'),
  (req, res) => {
    const redirect = req.session.oauth2return || '/';
    delete req.session.oauth2return;
    res.redirect(redirect);
  });

module.exports = router;
