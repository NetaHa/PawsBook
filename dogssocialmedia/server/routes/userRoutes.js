const express = require('express');
const router = express.Router();
const { User, readJsonAsync } = require('../models/User');  // Import readJsonAsync here


router.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;

    // Fetch the user from the database
    const user = await User.findOne({ email });

    if(user) {
        const isValidPassword = await User.validatePassword(password, user.password);
        
        if(isValidPassword) {
            const token = User.generateToken(user);
            return res.json({ token });
        }
    }
    
    return res.status(401).json({ error: 'Invalid credentials' });
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
});

module.exports = router;
