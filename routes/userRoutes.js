const express = require("express");
const User = require("../models/User"); // Adjust the path as necessary
const router = express.Router();

router.get("/", async (req, res) => {
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
router.put("/updatestatus", async (req, res) => {
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
router.delete("/delete", async (req, res) => {
  const { email } = req.body;
  try {
    console.log("i come to this" + email);
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

module.exports = router;
