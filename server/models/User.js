const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  admin: { type: Boolean, default: false },
}, { autoCreate: true });

module.exports = mongoose.model('User', userSchema);
