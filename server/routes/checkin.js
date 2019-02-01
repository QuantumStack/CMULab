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

function parseSectionTime(data) {
  const validStart = convertDate(moment({
    hour: data.start_hour,
    minute: data.start_minute,
  }));
  const validEnd = convertDate(moment({
    hour: data.end_hour,
    minute: data.end_minute,
  }));
  return [validStart, validEnd];
}

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

    if (!err) {
      if (student) {
        section = student.section;
        if (config.get('flagSection')) {
          const sections = config.get('sections');
          const validRange = sections[section];
          if (validRange) {
            const [validStart, validEnd] = parseSectionTime(validRange);
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
      const today = convertDate(moment().startOf('day'));
      Entry.find({
        student_id,
        date: { $gte: today },
      }).sort('date').exec((entryErr, entries) => {
        if (!entryErr && entries) {
          entries.filter(entry => entry.date > today).some((entry) => {
            const diff = now - entry.date;
            if (flagAttempts === 'time') {
              if (diff > config.get('flagAttemptsThreshold')) {
                flags.attempt = true;
                flags.attemptDiff = diff;
                flags.attemptScore = entry.score;
                return true;
              }
            } else if (flagAttempts === 'section') {
              const sections = config.get('sections');
              Object.values(sections).some((validRange) => {
                const [validStart, validEnd] = parseSectionTime(validRange);
                if (validStart <= now && now <= validEnd) {
                  if (entry.date < validStart || entry.date > validEnd) {
                    flags.attempt = true;
                    flags.attemptDiff = diff;
                    flags.attemptScore = entry.score;
                    flags.attemptSection = entry.section;
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

  Entry.update({
    student_id,
    date: { $gte: convertDate(moment().startOf('day')) },
  }, {
    $set: { good: false },
  }, { multi: true }, (err) => {
    if (err) return next(createError(500, err));
    const date = Date.now();
    const options = {
      student_id,
      date,
      section: section.toUpperCase(),
      lab: config.get('manualLab') ? req.body.lab : null,
      score,
      ta: req.user._id,
    };
    if (flags) {
      options.flags = JSON.parse(flags);
      if (config.get('flagInvalid')) options.good = false;
    }
    Entry.create(options, (createErr) => {
      if (createErr) return next(createError(500, createErr));

      // Create a message
      const message = {
        from: `CMULab for ${config.get('course')} <${process.env.CMULAB_SMTP_USER}>`,
        to: `${student_id}@${config.get('emailDomain')}`,
        subject: `You have been checked in to ${config.get('course')}!`,
        html: `
          <h4>You have been checked in through <a href="https://cmulab.quantumstack.xyz">CMULab</a> for ${config.get('course')}!</h4>
          <p>Please verify the contents of this email and ask your TA <span style="font-weight: bold">immediately</span> regarding any questions or clarifications.</p>
          <p><span style="font-weight: bold">Student ID:</span> ${student_id}
          </br><span style="font-weight: bold">Section:</span> ${section.toUpperCase()}
          </br><span style="font-weight: bold">Score:</span> ${score}
          </br><span style="font-weight: bold">Time:</span> ${convertDate(moment(date), -1, false).format('MMMM Do YYYY, h:mm:ss a')}
          </br><span style="font-weight: bold">TA:</span> ${req.user._id}</p>

          <small>&copy; <u><a href="https://quantumstack.xyz">QuantumStack 2019</a></small>
        `,
      };

      const info = email.sendMail(message).then((info) => {
        console.log(info);
      }).catch((err) => console.error(err));

      return res.redirect('/?success=check-in');

    });
  });
});

module.exports = router;
