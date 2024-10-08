const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
  },
  selectedItems: [
    {
      catalogueType: {
        type: String,
        required: true,
      },
      mealName: {
        type: String,
        required: true,
      },
    },
  ],
  qty: {
    type: Number,
    required: true,  
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  mealServedDate: {
    type: Date, // Date type for storing the meal served date
    required: true, // Set to true if you want it to be a required field
    default: Date.now,
  },
});

module.exports = mongoose.model('Meal', mealSchema);
