const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { readData, USERS_PATH } = require('../models/persist');  
const authenticate = require('../middleware/authenticate.js'); 

// GET Endpoint to fetch all users
router.get('/api/users', async (req, res) => {
    try {
        const users = await readData(USERS_PATH);
        res.json(users);  
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching users');
    }
});

router.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        const isValidPassword = await User.validatePassword(password, user.password);

        if (isValidPassword) {
            const token = User.generateToken(user);
            return res.json({ token });
        }
    }
    
    return res.status(401).json({ error: 'Invalid credentials' });
});

// Endpoint to fetch the logged-in user's data
router.get('/api/users/currentUser', authenticate, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        res.status(500).send('Error fetching user data');
    }
});

router.post('/api/users/follow/:userId', authenticate, async (req, res) => { 
    try {
        const userIdToFollow = req.params.userId; 
        const loggedInUserId = req.userId; 

        const loggedInUser = await User.findById(loggedInUserId);
        if (!loggedInUser.following.includes(userIdToFollow)) {
            loggedInUser.following.push(userIdToFollow);
            await User.update(loggedInUser); 
        }

        const userToFollow = await User.findById(userIdToFollow);
        if (!userToFollow.followers.includes(loggedInUserId)) {
            userToFollow.followers.push(loggedInUserId);
            await User.update(userToFollow); 
        }

        res.status(200).send({ message: 'Successfully followed the user' });
    } catch (error) {
        res.status(500).send({ message: 'Error in following the user', error });
    }
});

router.post('/api/users/unfollow/:userId', authenticate, async (req, res) => { 
    try {
        const userIdToUnfollow = req.params.userId;
        const loggedInUserId = req.userId; 

        // Find the logged-in user and update their following array
        const loggedInUser = await User.findById(loggedInUserId);
        loggedInUser.following = loggedInUser.following.filter(id => id !== userIdToUnfollow);
        await User.update(loggedInUser);

        // Find the user to be unfollowed and update their followers array
        const userToUnfollow = await User.findById(userIdToUnfollow);
        userToUnfollow.followers = userToUnfollow.followers.filter(id => id !== loggedInUserId);
        await User.update(userToUnfollow);

        res.status(200).send({ message: 'Successfully unfollowed the user' });
    } catch (error) {
        res.status(500).send({ message: 'Error in unfollowing the user', error });
    }
});

module.exports = router;

