const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

//signup
router.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const newUser = new User(data);
    // Save the new user to the database using await
    const savedUser = await newUser.save();
    console.log("Data saved successfully");

    const payload = {
      id: savedUser.id,
    };
    console.log(JSON.stringify(payload));

    const token = generateToken(payload);
    console.log("Token is: ", token);

    res.status(200).json({ savedUser: savedUser, token: token });
  } catch (error) {
    console.log("Error saving user:", error);
    res.status(500).json({ error: "Internal Server error" });
  }
});

//Login route
router.post("/login", async (req, res) => {
  try {
    const { aadharCardNumber, password } = req.body;
    const user = await User.findOne({ aadharCardNumber: aadharCardNumber });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username and password" });
    }
    const payload = {
      id: user.id,
    };
    const token = generateToken(payload);
    res.json({ token });
  } catch (error) {
    console.log("Error saving user:", error);
    res.status(500).json({ error: "Internal Server error" });
  }
});

//profile route
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;
    // console.log("User data ", userData);
    const userId = userData.id;
    const user = await User.findById(userId);

    res.status(200).json({ user: user });
  } catch (error) {
    console.log("Prodile not found", error);
    res.status(500).json({ error: "Profile Not found" });
  }
});

router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; //Extract the id from token
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Invalid username and password" });
    }
    user.password = newPassword;
    await user.save();

    console.log("Password updated");

    res.status(200).json({ message: "password updated" });
  } catch (error) {
    console.log("Error updating person:", error);
    res.status(500).json({ error: "Internal Server error" });
  }
});

module.exports = router;
