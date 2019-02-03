const express = require('express');
const passport = require('passport');

const router = express.Router();

/* GET login */
router.get('/',
  (req, res, next) => {
    // set return page url if necessary
    if (req.query.return) {
      req.session.oauth2return = req.query.return;
    }
    next();
  },
  // authenticate using passport, get email and basic profile info
  passport.authenticate('google', { scope: ['email', 'profile'] }));

/* GET login callback */
router.get('/callback',
  // authenticate using passport
  passport.authenticate('google'),
  (req, res) => {
    // redirect to original page or home if there was none
    const redirect = req.session.oauth2return || '/';
    delete req.session.oauth2return;
    res.redirect(redirect);
  });

module.exports = router;
