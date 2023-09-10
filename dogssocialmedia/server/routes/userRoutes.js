const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { readData, writeData, USERS_PATH } = require('../models/persist');
const bcrypt = require('bcrypt');

router.get('/api/randomDogImage', async (req, res) => {
    try {
        const users = await readData(USERS_PATH);
        const imagePaths = users.map(user => user.profileImagePath).filter(path => !!path);
        const randomImagePath = imagePaths[Math.floor(Math.random() * imagePaths.length)];
        const fixedPath = randomImagePath.replace(/\\/g, '/');

        res.json({ imagePath: fixedPath });
    } catch (err) {
        console.error('Error reading the file:', err);
        res.status(500).send('Error reading the file');
    }
});

router.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

  const token = User.generateToken(user);
  await User.updateActivity(user.id, "login");
  
  const isAdmin = email === "admin@gmail.com";  
  
  res.json({ token, isAdmin });
});

router.get('/api/users', async (req, res) => {
    try {
        const users = await readData(USERS_PATH);
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching users');
    }
});

router.delete('/api/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const users = await readData(USERS_PATH);

        const updatedUsers = users.filter(user => String(user.id) !== String(userId));
        
        await writeData(USERS_PATH, updatedUsers);

        res.json({ success: true, message: 'User deleted' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Internal server error while deleting user');
    }
});

module.exports = router;
