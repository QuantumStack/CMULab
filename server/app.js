const createError = require('http-errors');
const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const session = require('express-session');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const mongoose = require('mongoose');

const User = require('./models/User');
const indexRouter = require('./routes/index');
const checkinRouter = require('./routes/checkin');
const adminRouter = require('./routes/admin');
const loginRouter = require('./routes/login');

require('dotenv').config();

const app = express();

// view engine setup
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, '/views/layouts/'),
  partialsDir: path.join(__dirname, '/views/partials/'),
  helpers: {
    trim: str => str.toString().slice(0, str.toString().indexOf(' (UTC')),
    round: n => Math.round(n * 100) / 100,
    freqreduce: (arr) => {
      const freqs = {};
      arr.forEach((item) => {
        if (!freqs[item]) freqs[item] = 0;
        freqs[item] += 1;
      });
      return Object.entries(freqs).sort((a, b) => b[1] - a[1])
        .map(([item]) => item).join(', ');
    },
    range: (n, m) => {
      const L = [];
      for (let i = n; i <= m; i += 1) L.push(i);
      return L;
    },
  },
}));
app.set('view engine', 'hbs');

// various plugins
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public/'),
  dest: path.join(__dirname, 'public/'),
  indentedSyntax: true,
  outputStyle: 'compressed',
  sourceMap: true,
}));
app.use(express.static(path.join(__dirname, 'public')));

// configure passport
passport.use(new GoogleStrategy({
  clientID: process.env.CMULAB_GOOGLE_ID,
  clientSecret: process.env.CMULAB_GOOGLE_SECRET,
  callbackURL: `${process.env.CMULAB_LOC}/login/callback`,
  userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
}, (token, tokenSecret, profile, done) => {
  const email = profile.emails[0].value;
  if (!email.endsWith(`@${process.env.CMULAB_EMAILDOMAIN}`)) {
    return done('Not a university user');
  }
  const student_id = email.slice(0, email.lastIndexOf('@'));
  User.findOne({ _id: student_id }, (err, user) => {
    if (!user) return done('Not permitted');
    return done(err, user);
  });
}));
passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

// connect to db
mongoose.connect(process.env.CMULAB_DATABASE);

app.use('/', indexRouter);
app.use('/checkin', checkinRouter);
app.use('/admin', adminRouter);
app.use('/login', loginRouter);

/* POST go to checkin */
app.post('/go', (req, res) => {
  const { student_id } = req.body;
  if (!student_id) return res.redirect('/');
  res.redirect(`/checkin/${student_id}`);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(err.status || 500);
  res.render('error', {
    course: process.env.CMULAB_COURSE,
    loc: process.env.CMULAB_LOC,
    err,
  });
});

module.exports = app;
