const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendMail } = require("../services/mailService"); // Ensure this path is correct
const jwt = require("jsonwebtoken");
const importNxbEmployessData = require("../services/importNxbEmployessData");

const loginUser = async (req) => {
  // await importNxbEmployessData.fetchAndProcessUsers();
  // importNxbEmployessData.updateUserStatus();
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    return { token };
  } catch (error) {
    throw new Error(error.message);
  }
};
const requestPasswordReset = async (req) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 900000;
    await user.save();

    const subject = "Password Reset";
    const htmlContent = `<p>You requested a password reset. Link is valid for 15 minutes. Click <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">here</a> to reset your password.</p>`;

    await sendMail(user.email, subject, htmlContent);

    return { message: "Password reset email sent" };
  } catch (error) {
    throw new Error(error.message);
  }
};

const resetPassword = async (token, newPassword) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decodedToken.userId,
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    return { message: "Password reset successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  loginUser,
  requestPasswordReset,
  resetPassword,
};
