const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/auth");
const catalogueRoutes = require("./routes/catalogue");
const mealRecord = require("./routes/mealRecord");
const mealRoutes = require('./routes/mealRoutes');

app.use(express.json({ limit: '50mb' })); // For JSON requests
app.use(express.urlencoded({ limit: '50mb', extended: true })); //
app.use(bodyParser.json());
app.use(cors());
app.use('/api/meals', mealRecord);//private
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);//private
app.use("/api/catalogues",catalogueRoutes);//private
app.use('/api/menu', mealRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.get("/reset-password/:token", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "reset-password.html"));
});
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
