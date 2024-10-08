const mongoose = require('mongoose');

const mealRecordSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
  },
  meal_slot: {
    type: String,
    required: true,  
  },
  meal_name: {
    type: String,
    required: true,
  },
  meal_id: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('MealRecord', mealRecordSchema);
