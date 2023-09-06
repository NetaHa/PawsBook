const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  
const { User } = require('./models/User');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const followingRoutes = require('./routes/followingRoutes.js');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(userRoutes);
app.use(postRoutes);
app.use(followingRoutes); 

// Registration route
app.post('/api/users/register', async (req, res) => {
  try {
    const userData = req.body;

    // Check if user already exists before creating
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    await User.create(userData);
    if (!userData.email || !userData.password || !userData.userName) {
      return res.status(400).json({ message: 'Missing required fields' });
  }
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Login route
app.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }

    const isValidPassword = await User.validatePassword(password, user.password);
    if (!isValidPassword) {
        return res.status(400).json({ error: 'Invalid password' });
    }

    const token = User.generateToken(user);
    res.json({ token });
});

app.listen(5000, () => {
  console.log('Server started on http://localhost:5000');
});
