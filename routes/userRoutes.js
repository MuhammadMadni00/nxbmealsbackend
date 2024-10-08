const express = require("express");
const User = require("../models/User"); // Adjust the path as necessary
const authenticateToken = require("../middleware/authenticatetoken");
const router = express.Router();
//index
router.get("/", authenticateToken, async (req, res) => {
  try {
    const users = await User.find(
      {},
      "email first_name last_name employee_id  active"
    );
    const formattedUsers = users.map((user) => ({
      Email: user.email,
      Name: `${user.first_name} ${user.last_name}`,
      ID: user.employee_id,
      Type: "User",
      Status: user.active ? "Active" : "Inactive",
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
//update
router.put("/updatestatus", authenticateToken, async (req, res) => {
  const { email, status } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.active = status;
    await user.save();

    res.json({ message: `User status updated to ${status}`, user });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Server error" });
  }
});
//delete
router.delete("/delete", authenticateToken, async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOneAndDelete({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Server error" });
  }
});
//show user
router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ employee_id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user data", error: err });
  }
});

module.exports = router;
