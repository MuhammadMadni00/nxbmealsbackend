const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Menu', menuSchema);
