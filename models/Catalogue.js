const mongoose = require("mongoose");
const catalogueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  status: { type: String, default: "Active" },
});
module.exports = mongoose.model("Catalogue", catalogueSchema);
