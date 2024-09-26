const express = require("express");
const router = express.Router();
const authService = require("../services/authService");
//signup
// router.post("/signup", async (req, res) => {
//   try {
//     const response = await authService.registerUser(req);
//     console.log(response);

//     res.status(201).json(response);
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ message: error.message });
//   }
// });
//login
router.post("/login", async (req, res) => {
  try {

    const result = await authService.loginUser(req);
    console.log(result);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//forgot password
router.post("/forgot-password", async (req, res) => {
  try {
    const result = await authService.requestPasswordReset(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//reset password
router.post("/reset-password/:token", async (req, res) => {
  const { password } = req.body;
  const token = req.params.token;

  try {
    const result = await authService.resetPassword(token, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
