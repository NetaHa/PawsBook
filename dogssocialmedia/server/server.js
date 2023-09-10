const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  
const multer = require('multer');
const path = require('path');
const { User } = require('./models/User');
require('dotenv').config();

// Routes
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const followingRoutes = require('./routes/followingRoutes.js');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use(userRoutes);
app.use(postRoutes);
app.use(followingRoutes);

app.post('/api/users/register', upload.single('profileImage'), async (req, res) => {
  try {
    const { email, password, userName } = req.body;
    if (!email || !password || !userName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const userData = req.body;
    if (req.file) {
      userData.profileImagePath = req.file.path;
    }

    await User.create(userData);
    res.json({ message: 'User registered successfully' });
    await User.updateActivity(user.id, "registered");
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.use((err, req, res, next) => { 
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
