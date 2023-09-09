const express = require('express');
const router = express.Router();
const { User, readJsonAsync } = require('../models/User');  
const fs = require('fs');
const path = require('path');
const POSTS_FILE_PATH = path.join(__dirname, '..', 'models', 'data', 'users.json');
const authenticate = require('../middleware/authenticate.js');
const bcrypt = require('bcrypt');

router.get('/api/randomDogImage', (req, res) => {
    // Read the users.json file
    fs.readFile(POSTS_FILE_PATH, 'utf8', (err, jsonString) => {
        if (err) {
            console.error('Error reading the file:', err);
            return res.status(500).send('Error reading the file');
        }

        // Parse the JSON
        const users = JSON.parse(jsonString);

        // Extract all the image paths
        const imagePaths = users.map(user => user.profileImagePath).filter(path => !!path);

        // Choose a random image path
        const randomImagePath = imagePaths[Math.floor(Math.random() * imagePaths.length)];
        const fixedPath = randomImagePath.replace(/\\/g, '/');

        // Send the random image path in the response
        res.json({ imagePath: fixedPath });
    });
});

router.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
      return res.status(400).json({ error: 'User not found' });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);  // Using bcrypt here too
  if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid password' });
  }

  const token = User.generateToken(user);
  await User.updateActivity(user.id, "login");
  
  const isAdmin = email === "admin@gmail.com";  // Check if the user is an admin based on email
  console.log("Server is sending isAdmin as:", isAdmin); 

  res.json({ token, isAdmin });
});

// GET Endpoint to fetch all users
router.get('/api/users', async (req, res) => {
    try {
        const users = await readJsonAsync(User.dbPath); 
        res.json(users);  // Send users as JSON response
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching users');
    }

    const fs = require('fs');  
});

router.delete('/api/users/:id', (req, res) => {
    try {
        const userId = req.params.id;
        const users = JSON.parse(fs.readFileSync(POSTS_FILE_PATH, 'utf8'));

        const updatedUsers = users.filter(user => String(user.id) !== String(userId));
        
        fs.writeFileSync(POSTS_FILE_PATH, JSON.stringify(updatedUsers, null, 4));

        res.json({ success: true, message: 'User deleted' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Internal server error while deleting user');
    }
});

module.exports = router;
