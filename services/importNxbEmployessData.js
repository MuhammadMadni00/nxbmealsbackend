const User = require("../models/User");
const axios = require("axios"); 
const BASE_URL = "https://nexthrm.vteamslabs.com/api";
const AUTH_KEY =
  "next3yQDHqRgnveYD2BqhLcIyFCHJ9CcfU5ONsRMasoCirEjUKQOOhQqYKAToJAd";
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const generatePassword = () => {
  return crypto.randomBytes(4).toString("hex"); 
};
const fetchAndProcessUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/all-employees`, {
      headers: {
        RemoteApiAuthToken: AUTH_KEY,
      },
    });
    const userData = response.data.data;

    if (userData && userData.length) {
      console.log(`NXB Data Import started at ${new Date()}`);
      for (const nxbUser of userData) {
        const [first_name, last_name] = nxbUser.Name.split(" ");
        const employee_id = nxbUser.Id;
        const email = nxbUser.Email || null;

        try {
          let user = await User.findOne({ employee_id });
          if (!user) {
            const password = generatePassword();
            user = new User({
              first_name,
              last_name,
              employee_id,
              email,
              user_name: nxbUser.UserName || first_name + employee_id,
              password,
              active: true,
            });
            if (email) {
              await user.save();
            } else {
              await user.save({ validateBeforeSave: false });
            }
          }
          user.first_name = first_name;
          user.last_name = last_name;
          user.profile_url = nxbUser.profile_image;
          user.resetToken = undefined;
          user.resetTokenExpiration = undefined;
          if (nxbUser.Location && nxbUser.Location.Center) {
            user.location = nxbUser.Location.Center;
          }

          if (nxbUser.meal_subscription === "4") {
            user.is_free_meal = true;
          }

          if (email) {
            await user.save();
          } else {
            await user.save({ validateBeforeSave: false });
          }
        } catch (err) {
          console.error(
            `Problem while importing data for user: ${nxbUser.Name}`
          );
          console.error(`Error: ${err.message}`);
        }
      }
    } else {
      console.log("No user data found in API response.");
    }
  } catch (error) {
    console.error("Error fetching users from API: ", error.message);
  }
};
module.exports = {
  fetchAndProcessUsers,
  // updateUserStatus
};
