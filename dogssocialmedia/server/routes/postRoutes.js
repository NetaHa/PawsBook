const express = require('express');
const router = express.Router();
const { User } = require('../models/User.js');
const { Post } = require('../models/Post.js'); 
const authenticate = require('../middleware/authenticate.js');
const fs = require('fs');
const path = require('path');
const POSTS_FILE_PATH = path.join(__dirname, '..', 'models', 'data', 'posts.json');

const readPostsFromFile = () => {
    try {
        const data = fs.readFileSync(POSTS_FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading posts from file:', err);
        return [];
    }
};

const savePostsToFile = (posts) => {
    try {
        fs.writeFileSync(POSTS_FILE_PATH, JSON.stringify(posts, null, 2));
    } catch (err) {
        console.error('Error writing posts to file:', err);
    }
};

// Initialize posts from file
const posts = readPostsFromFile();

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

router.post('/api/posts', authenticate, async (req, res) => {
    const { content } = req.body;
    const userId = req.userId;
    // Fetch the user from the database using the userId
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Extract the userName from the fetched user
    const userName = user.userName;

    const newPost = {
        id: posts.length + 1,
        userName: userName,
        content: content,
        userId: userId,
        likes: [],
        time: new Date().toISOString()
    };

    posts.push(newPost);
    savePostsToFile(posts);  // Save the updated posts array to file.
    res.json(newPost);
});

router.patch('/api/posts/:postId/like', authenticate, (req, res) => {
    const postId = parseInt(req.params.postId, 10);
    const userId = req.userId;
    const post = posts.find(p => p.id === postId);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    if (!post.likes.includes(userId)) {
        post.likes.push(userId);
        savePostsToFile(posts);
    }
    res.json(post);
});

router.patch('/api/posts/:postId/unlike', authenticate, (req, res) => {
    const postId = parseInt(req.params.postId, 10);
    const userId = req.userId;
    const post = posts.find(p => p.id === postId);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const index = post.likes.indexOf(userId);
    if (index > -1) {
        post.likes.splice(index, 1);
        savePostsToFile(posts);
    }
    res.json(post);
});

router.get('/api/posts', authenticate, async (req, res) => {
    const currentUserId = req.userId;

    const enrichedPosts = await Promise.all(posts.map(async post => {
        const user = await User.findById(post.userId);
        return {
            ...post,
            userName: user.name,
            isLikedByCurrentUser: post.likes.includes(currentUserId),
            likesCount: post.likes.length
        };
    }));

    res.json(enrichedPosts);
});

module.exports = router;
