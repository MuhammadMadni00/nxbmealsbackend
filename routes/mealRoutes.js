const express = require('express');
const router = express.Router();
const Catalogue = require('../models/Catalogue');
const Meal = require('../models/meal');

router.post('/', async (req, res) => {
  const { employee_id, selectedItems, qty } = req.body;

  try {
    console.log("xxx",selectedItems)
    let totalPrice = 0;

    for (const item of selectedItems) {
      const catalogueItem = await Catalogue.findOne({
        name: item.mealName,
        type: item.catalogueType,
        status: 'Active', // Only consider active items
      });

     
      if (catalogueItem) {

        totalPrice += catalogueItem.price; // Add price of each selected item
      }
    }

    totalPrice *= qty;

    const meal = new Meal({
      employee_id,
      selectedItems,
      qty, 
      totalPrice,  
    });

    const savedMeal = await meal.save();
    res.status(201).json(savedMeal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get('/', async (req, res) => {
    try {
      const meals = await Meal.find(); // Fetch all meal orders
      res.json(meals);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get a specific meal order by ID
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const meal = await Meal.findById(id); // Fetch a meal order by its ID
      if (!meal) {
        return res.status(404).json({ message: 'Meal not found' });
      }
      res.json(meal);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
module.exports = router;
