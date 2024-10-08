const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const storage = multer.memoryStorage(); // Store file in memory for processing
const upload = multer({ storage: storage });
const Catalogue = require("../models/Catalogue");
const authenticateToken = require("../middleware/authenticatetoken");
const router = express.Router();
//create catalogue
router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const imageBuffer = req.file.buffer;
      const imageBase64 = imageBuffer.toString("base64");

      const name = req.body.name;
      const type = req.body.type;
      const price = req.body.price;
      const newCatalogueItem = new Catalogue({
        name: name,
        type: type,
        price: price,
        image: imageBase64,
        status: "Active",
      });

      await newCatalogueItem.save();

      res.status(201).json({ message: "Catalogue item created successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating catalogue item", error });
    }
  }
);
//get specific catalogue
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const catalogueItem = await Catalogue.findById(id);
    if (!catalogueItem) {
      return res.status(404).json({ message: "Catalogue item not found" });
    }
    res.json(catalogueItem);
  } catch (error) {
    console.error("Error fetching catalogue:", error);
    res.status(500).json({ message: "Server error" });
  }
});
//get all catalogues
router.get("/", authenticateToken, async (req, res) => {
  try {
    const items = await Catalogue.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching catalogue", error });
  }
});
//update
router.put(
  "/:id",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    const { id } = req.params;
    const { name, type, price, status } = req.body;

    try {
      let imageBase64;
      if (req.file) {
        const imageBuffer = req.file.buffer;
        imageBase64 = imageBuffer.toString("base64");
      }

      const updateData = {
        name,
        type,
        price,
        status,
      };

      if (imageBase64) {
        updateData.image = imageBase64;
      }

      const updatedItem = await Catalogue.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!updatedItem) {
        return res.status(404).json({ message: "Catalogue item not found" });
      }

      res.json(updatedItem);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error updating catalogue item", error });
    }
  }
);
//delete
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await Catalogue.findByIdAndDelete(id);
    res.json({ message: "Catalogue item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting catalogue item", error });
  }
});
module.exports = router;
