const mongoose = require('mongoose');
const config = require('./../util/config');

const entrySchema = new mongoose.Schema({
  student_id: { type: String, required: true },
  date: { type: Date, required: true },
  lab: { type: String },
  section: { type: String, required: true, uppercase: true },
  score: {
    type: Number,
    required: true,
    min: config.get('minScore'),
    max: config.get('maxScore'),
  },
  ta: { type: String, required: true },
  flag: [{ type: String, enum: ['ghost', 'attempt', 'score'], required: true }],
});

module.exports = mongoose.model('Entry', entrySchema);
