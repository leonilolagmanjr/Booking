const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Info = require('../models/Info');

// Service to register a user
const registerUser = async ({ name, password }) => {
  // Check if user already exists
  const userExists = await User.findOne({ name });
  if (userExists) throw new Error('User already exists');

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create the user
  const newUser = await User.create({
    name,
    password: hashedPassword,
  });

  // Create user info
  const userInfo = await Info.create({
    user: newUser._id,
  });
  // Generate JWT token
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  return {
    token,
    user: {
      id: newUser._id,
      name: newUser.name,
      xp: newUser.xp,
    },
  };
};

// Service to login a user
const loginUser = async ({ name, password }) => {
  // Find user
  const user = await User.findOne({ name });
  if (!user) throw new Error('Invalid credentials');

  // Check password match
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      xp: user.xp,
    },
  };
};

module.exports = {
  registerUser,
  loginUser,
};
