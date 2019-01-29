const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  student_id: { type: String, required: true },
  date: { type: Date, required: true },
  lab: { type: String },
  section: { type: String, required: true, uppercase: true },
  score: {
    type: Number,
    required: true,
    min: process.env.CMULAB_MINSCORE,
    max: process.env.CMULAB_MAXSCORE,
  },
  ta: { type: String, required: true },
});

module.exports = mongoose.model('Entry', entrySchema);
