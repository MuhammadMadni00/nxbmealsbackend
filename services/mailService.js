const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to,
      subject,
      html: htmlContent,
    };
    console.log(mailOptions);
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Could not send email");
  }
};

module.exports = { sendMail };
