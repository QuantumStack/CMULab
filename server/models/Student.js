const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  section: { type: String, required: true },
});

module.exports = mongoose.model('Student', studentSchema);
