const express = require('express');
const router = express.Router();
const { User, readJsonAsync } = require('../models/User');  
const fs = require('fs');
const path = require('path');
const POSTS_FILE_PATH = path.join(__dirname, '..', 'models', 'data', 'users.json');
const authenticate = require('../middleware/authenticate.js');


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

// router.post('/api/users/login', async (req, res) => {
//     const { email, password } = req.body;

//     // Fetch the user from the database
//     const user = await User.findOne({ email });

//     if(user) {
//         const isValidPassword = await User.validatePassword(password, user.password);
        
//         if(isValidPassword) {
//             const token = User.generateToken(user);
//             return res.json({ token });
//         }
//     }
    
//     return res.status(401).json({ error: 'Invalid credentials' });
// });

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

module.exports = router;
