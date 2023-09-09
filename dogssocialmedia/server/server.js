const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  
const { User } = require('./models/User');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const followingRoutes = require('./routes/followingRoutes.js');

const app = express();
const path = require('path');

app.use(cors());
app.use(bodyParser.json());
app.use(userRoutes);
app.use(postRoutes);
app.use(followingRoutes);
app.use('/uploads', express.static('uploads'));

app.use((err, req, res, next) => { 
  res.status(500).send('Something broke!');
});

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Registration route
app.post('/api/users/register', upload.single('profileImage'), async (req, res) => {
  try {
    const userData = req.body;

    if (req.file) {
      userData.profileImagePath = req.file.path;
    }
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
    await User.updateActivity(user.id, "registered");
    } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.listen(5000, () => {
  console.log('Server started on http://localhost:5000');
});
