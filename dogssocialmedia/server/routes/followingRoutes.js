// const express = require('express');
// const fs = require('fs');
// const router = express.Router();

// const getUsersFromFile = () => {
//     try {
//         const data = fs.readFileSync('./models/data/users.json', 'utf8');
//         return JSON.parse(data);
//     } catch (err) {
//         console.error("Error reading users from file:", err);
//         return [];
//     }
// };

// // GET Endpoint to fetch all users
// router.get('/api/users', (req, res) => {
//     const userId = req.userId;
//     const user = User.findById(userId);
//     if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//     }
//     const loggedInUserId = userId;  // we assume you send the logged-in user's ID as a query parameter

//     const allUsers = getUsersFromFile();
//     const filteredUsers = allUsers.filter(user => user.id !== loggedInUserId)
//                                   .map(({password, ...rest}) => rest);  // Exclude the password for security reasons

//     res.json(filteredUsers);
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const { User } = require('../models/User'); 

router.post('/follow/:userId', async (req, res) => {
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
router.post('/unfollow/:userId', async (req, res) => {
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

