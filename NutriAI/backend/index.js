const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const user = require('./schema/User.js');
const dotenv = require("dotenv");

const app = express();
dotenv.config();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// MongoDB Atlas Connection
mongoose.connect(process.env.MongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Signup Route
app.post("/signup", async (req, res) => {
  try {
    console.log("Received signup data:", req.body);
    const { name, email, password, height, weight, healthConditions } = req.body;

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered", isSignUp: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new user({
      name,
      email,
      password: hashedPassword,
      height,
      weight,
      healthConditions,
    });

    await newUser.save();

    console.log("Signup Successful");
    res.status(201).json({ message: "Signup Successful", isSignUp: true });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error", isSignUp: false });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "Account not found", isLoggedin: false });
    }

    const isValidPassword = await bcrypt.compare(password, existingUser.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Incorrect password", isLoggedin: false });
    }

    res.status(200).json({ message: "Login Successful", isLoggedin: true });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error", isLoggedin: false });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
