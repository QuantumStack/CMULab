const express = require('express');
const createError = require('http-errors');
const moment = require('moment');
const email = require('./../util/mail');
const config = require('./../util/config');
const convertDate = require('./../util/convertDate');
const Entry = require('./../models/Entry');
const Student = require('./../models/Student');
const authRequired = require('./../util/authRequired');

const router = express.Router();

// parse section time data from configs into date values using moment
function parseSectionTime(data) {
  const validStart = convertDate(moment({
    hour: Number.parseInt(data.start_hour, 10),
    minute: Number.parseInt(data.start_minute, 10),
  }));
  const validEnd = convertDate(moment({
    hour: Number.parseInt(data.end_hour, 10),
    minute: Number.parseInt(data.end_minute, 10),
  }));
  return [validStart, validEnd];
}

/* GET checkin form */
router.get('/:student_id', authRequired, (req, res) => {
  let { student_id } = req.params;
  // convert student_id to lowercase if necessary
  if (config.get('lowercaseStudents')) student_id = student_id.toLowerCase();
  // query student with given _id
  Student.findOne({ _id: student_id }, (err, student) => {
    let section;
    const flags = {};

    // render page with queried data and relevant configs
    function renderPage() {
      res.render('checkin', {
        course: config.get('course'),
        loc: process.env.CMULAB_LOC,
        student: req.params.student_id,
        section,
        radio: config.get('radioInput'),
        lab: config.get('manualLab'),
        allowOverride: config.get('allowOverride'),
        minscore: Number.parseInt(config.get('minScore'), 10),
        maxscore: Number.parseInt(config.get('maxScore'), 10),
        flags,
      });
    }

    // right now!
    const now = Date.now();

    if (!err) {
      if (student) {
        // set student section if available
        section = student.section;
        // flag wrong section if necessary
        if (config.get('flagSection')) {
          const sections = config.get('sections');
          const validRange = sections[section];
          if (validRange) {
            // check if now is outside the tmie range of the registered section
            const [validStart, validEnd] = parseSectionTime(validRange);
            if (now < validStart || now > validEnd) {
              flags.section = true;
            }
          }
        }
      // flag unregistered student if necessary
      } else if (config.get('flagGhosts')) {
        flags.ghost = true;
      }
    }

    // flag too many attempts if necessary
    const flagAttempts = config.get('flagAttempts');
    if (flagAttempts) {
      // start of current day (UTC)
      const today = convertDate(moment().startOf('day'));
      // query entries with given student_id from today, sort by date
      Entry.find({
        student_id,
        date: { $gte: today },
      }).sort('date').exec((entryErr, entries) => {
        if (!entryErr && entries) {
          for (let i = 0; i < entries.length; i += 1) {
            // compute difference between right now and when each entry was recorded
            const diff = now - entries[i].date;
            // flag attempt based on time if necessary
            if (flagAttempts === 'time') {
              // check if time interval between attempts is greater than threshold
              if (diff > config.get('flagAttemptsThreshold')) {
                flags.attempt = true;
                flags.attemptDiff = diff;
                flags.attemptScore = entries[i].score;
                return true;
              }
            // flag attempt based on section if necessary
            } else if (flagAttempts === 'section') {
              const sections = config.get('sections');
              const validRanges = Object.values(sections);
              // loop through section times
              for (let j = 0; j < validRanges.length; j += 1) {
                // convert section times from to UTC
                const [validStart, validEnd] = parseSectionTime(validRanges[j]);
                // check if we are currently in this section time
                if (validStart <= now && now <= validEnd) {
                  // check if the entry under review is not from this section time
                  if (entries[i].date < validStart || entries[i].date > validEnd) {
                    flags.attempt = true;
                    flags.attemptDiff = diff;
                    flags.attemptScore = entries[i].score;
                    flags.attemptSection = entries[i].section;
                  }
                  // we're done searching for an ongoing section
                  break;
                }
              }
            }
          }
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
  const {
    section, score, flags, override,
  } = req.body;
  if (!section || !score) {
    return next(createError(400, 'Provide section and score'));
  }
  // make sure score is within configured range
  if (score < config.get('minScore') || score > config.get('maxScore')) {
    return next(createError(400, 'Invalid score'));
  }

  let { student_id } = req.params;
  // convert student_id to lowercase if necessary
  if (config.get('lowercaseStudents')) student_id = student_id.toLowerCase();

  // start of current day (UTC)
  const today = convertDate(moment().startOf('day'));
  // query entries with given student_id from today and mark them as not good
  Entry.update({
    student_id,
    date: { $gte: today },
  }, {
    $set: { good: false },
  }, { multi: true }, (err) => {
    if (err) return next(createError(500, err));
    // right now!
    const date = Date.now();
    // set default checkin data
    const options = {
      student_id,
      date,
      section: section.toUpperCase(),
      lab: config.get('manualLab') ? req.body.lab : null,
      score,
      ta: req.user._id,
    };
    // set flags that were computed on checkin load if necessary
    if (flags) {
      options.flags = JSON.parse(flags);
      // mark new entry as not good if necessary
      if (config.get('flagInvalid')) options.good = false;
      // mark new entry as good if check-in override
      const allowOverride = config.get('allowOverride');
      if (allowOverride && override === 'good') options.good = true;
    }
    // save entry to db
    Entry.create(options, (createErr) => {
      if (createErr) return next(createError(500, createErr));

      // send a confirmation email if necessary
      if (process.env.CMULAB_SMTP_SERVER) {
        // create a message
        const message = {
          from: `CMULab for ${config.get('course')} <${process.env.CMULAB_SMTP_USER}>`,
          to: `${student_id}@${config.get('emailDomain')}`,
          subject: `You have been checked in to ${config.get('course')}!`,
          html: `
            <h4>You have been checked in through <a href="https://cmulab.quantumstack.xyz">CMULab</a> for ${config.get('course')}!</h4>
            <p>Please verify the contents of this email and ask your TA <span style="font-weight: bold">immediately</span> regarding any questions or clarifications.</p>
            <p><span style="font-weight: bold">Student ID:</span> ${student_id}
            <br /><span style="font-weight: bold">Section:</span> ${section.toUpperCase()}
            <br /><span style="font-weight: bold">Score:</span> ${score}
            <br /><span style="font-weight: bold">Time:</span> ${convertDate(moment(date), -1, false).format('MMMM Do YYYY, h:mm:ss a')}
            <br /><span style="font-weight: bold">TA:</span> ${req.user._id}</p>

            <p>Best,<br />${config.get('course')} Staff</p>


            <small>&copy; <a href="https://quantumstack.xyz/?ref=cmulab">QuantumStack</a> 2019</small>
          `,
        };

        // send the message
        email.sendMail(message)
          .then(() => res.redirect('/?success=check-in'))
          .catch(emailErr => next(createError(500, emailErr)));
      } else {
        return res.redirect('/?success=check-in');
      }
    });
  });
});

module.exports = router;
