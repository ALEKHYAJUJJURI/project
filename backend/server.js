const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Frontend origin
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mernauth', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// User model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Generate tokens
const generateTokens = (email) => {
  const accessToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1m' });
  const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
  return { accessToken, refreshToken };
};

// Signup
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const { accessToken, refreshToken } = generateTokens(user.email);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge:3*24*60*60*1000
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Refresh token
app.post('/api/refresh-token', (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(403).json({ error: 'Refresh token is required' });
  }

  try {
    const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(verified.email);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
    });
    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(400).json({ error: 'Invalid refresh token' });
  }
});

// Protected route
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'Protected route accessed', email: req.user.email });
});

// Logout
app.post('/api/logout', (req, res) => {
  res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'None' });
  res.status(200).json({ message: 'Logged out successfully' });
});

app.listen(5002, () => console.log('Server running on port 5002'));
