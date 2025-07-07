const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },           // Your cat's name
  breed: { type: String, required: true },          // e.g. Maine Coon, Siamese
  age: { type: Number },
  careInstructions: { type: String },               // General care info
  feedingSchedule: { type: String },                // e.g. "Twice a day"
  medicalNeeds: { type: String },                   // e.g. allergies, meds
  image: { type: String },                          // URL to cat's image
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Owner
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);