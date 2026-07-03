const bcrypt = require("bcryptjs");
const User = require("../model/UserModel");
const { createSecretToken } = require("../util/SecretToken");

// LOGIN
module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User logged in successfully",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// SIGNUP
module.exports.Signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
        success: false,
      });
    }

    
    const user = await User.create({
      email,
      username,
      password,
    });

    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User signed up successfully",
      success: true,
    });

  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};