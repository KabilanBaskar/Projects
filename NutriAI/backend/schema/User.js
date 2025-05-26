const mongoose = require('mongoose');

const healthConditionsSchema = new mongoose.Schema({
  bloodPressure: { type: Boolean, default: false },
  diabetes: { type: Boolean, default: false },
  heartDisease: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  height: {
    type: Number, // in cm or inches, depending on your app
    required: true,
  },
  weight: {
    type: Number, // in kg or lbs
    required: true,
  },
  healthConditions: {
    type: healthConditionsSchema,
    default: {},
  },
}, {
  timestamps: true, // adds createdAt and updatedAt
});
module.exports = mongoose.model('users', userSchema);
