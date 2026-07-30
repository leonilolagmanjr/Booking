const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  type: { type: String, enum: ['remote', 'physical'], required: true },
  address: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
