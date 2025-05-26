const mongoose = require('mongoose');

const selectionSchema = new mongoose.Schema({
  userId: String,
  dishes: Array,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Selection', selectionSchema);
