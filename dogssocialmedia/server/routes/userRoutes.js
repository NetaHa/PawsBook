const express = require('express');
const router = express.Router();
const { User } = require('../models/User.js'); 

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

module.exports = router;
