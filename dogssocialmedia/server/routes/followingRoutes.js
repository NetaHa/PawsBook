const express = require('express');
const router = express.Router();
const { User, readJsonAsync } = require('../models/User');

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
router.post('/api/users/follow/:userId', async (req, res) => {
    console.log("Follow route accessed");
    try {
        const userIdToFollow = req.params.userId; 
        const loggedInUserId = req.body.followerId; // This is the logged-in user sending the request
        console.log(loggedInUserId);
        // Find the logged-in user and update their following array
        const loggedInUser = await User.findById(loggedInUserId);
        if (!loggedInUser.following.includes(userIdToFollow)) {
            loggedInUser.following.push(userIdToFollow);
            await User.update(loggedInUser); 
        }

        // Find the user to be followed and update their followers array
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
    router.post('/api/users/unfollow/:userId', async (req, res) => {
    console.log("Unfollow route accessed");
    try {
        const userIdToUnfollow = req.params.userId;
        const loggedInUserId = req.body.followerId;

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

