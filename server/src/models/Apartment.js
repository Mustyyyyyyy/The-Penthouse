const mongoose = require("mongoose");

const apartmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  rooms: Number,
  images: [String],
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model("Apartment", apartmentSchema);