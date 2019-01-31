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
  flag: {
    ghost: { type: Boolean },
    attempt: {
      diff: { type: Number },
      section: { type: String, uppercase: true },
      score: { type: Number },
    },
    section: { type: String, uppercase: true },
  },
});

module.exports = mongoose.model('Entry', entrySchema);
