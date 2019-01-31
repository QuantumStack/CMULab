const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  student_id: { type: String, required: true },
  date: { type: Date, required: true },
  lab: { type: String },
  section: { type: String, required: true, uppercase: true },
  score: {
    type: Number,
    required: true,
  },
  ta: { type: String, required: true },
  good: { type: Boolean, default: true },
  flags: {
    ghost: { type: Boolean },
    attempt: { type: Boolean },
    attemptDiff: { type: Number },
    attemptSection: { type: String, uppercase: true },
    attemptScore: { type: Number },
    section: { type: Boolean },
  },
});

module.exports = mongoose.model('Entry', entrySchema);
