const express = require("express");
const multer = require('multer');
const sharp = require('sharp');
const storage = multer.memoryStorage(); // Store file in memory for processing
const upload = multer({ storage: storage });
const Catalogue = require("../models/Catalogue");
const router = express.Router();
router.post('/', upload.single('image'), async(req, res) => {

 
  try {
    console.log("Request received");

    // Access the uploaded image
    const imageBuffer = req.file.buffer; // Image in buffer format
    const imageBase64 = imageBuffer.toString("base64"); // Convert image to base64 string
    
    const name = req.body.name;
    const type = req.body.type;
    const price = req.body.price;

    // Log incoming data for debugging
    console.log(name, type, price, imageBase64);

    // Create a new catalogue item and save it to the database
    const newCatalogueItem = new Catalogue({
      name: name,
      type: type,
      price: price,
      image: imageBase64, // Save base64 encoded image
      status: "Active",   // Default status
    });

    // Save the new item to MongoDB
    await newCatalogueItem.save();

    // Respond with a success message
    res.status(201).json({ message: "Catalogue item created successfully!" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Error creating catalogue item", error });
  }
});

  
router.get("/", async (req, res) => {
  try {
    const items = await Catalogue.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching catalogue", error });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, type, price, image, status } = req.body;
  try {
    const updatedItem = await Catalogue.findByIdAndUpdate(
      id,
      { name, type, price, image, status },
      { new: true }
    );
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: "Error updating catalogue item", error });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Catalogue.findByIdAndDelete(id);
    res.json({ message: "Catalogue item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting catalogue item", error });
  }
});
module.exports = router;
