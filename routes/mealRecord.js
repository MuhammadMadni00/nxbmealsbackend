const express = require("express");
const router = express.Router();
const MealRecord = require("../models/mealRecord");
const authenticateToken = require("../middleware/authenticatetoken");

// Create a new meal record
router.post("/create", async (req, res) => {
  const { employee_id, meal_slot, meal_name, meal_id, qty, price } = req.body;
  try {
    const newMealRecord = new MealRecord({
      employee_id,
      meal_slot,
      meal_name,
      meal_id,
      qty,
      price,
    });

    await newMealRecord.save();
    res
      .status(201)
      .json({
        message: "Meal record created successfully",
        data: newMealRecord,
      });
  } catch (err) {
    res.status(500).json({ message: "Error creating meal record", error: err });
  }
});
//show meals of specific employee
router.get("/:employee_id", async (req, res) => {
  const { employee_id } = req.params;
  try {
    const mealRecords = await MealRecord.find({ employee_id });
    res.status(200).json(mealRecords);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching meal records", error: err });
  }
});
//show all meals
router.get("/", authenticateToken, async (req, res) => {
  try {
    const mealRecords = await MealRecord.find();

    const groupedRecords = mealRecords.reduce((acc, record) => {
      const { employee_id } = record;
      if (!acc[employee_id]) {
        acc[employee_id] = [];
      }
      acc[employee_id].push(record);
      return acc;
    }, {});

    res.status(200).json(groupedRecords); // Respond with grouped records
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching meal records", error: err });
  }
});

module.exports = router;
