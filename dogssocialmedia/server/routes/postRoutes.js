const express = require('express');
const router = express.Router();
const { User } = require('../models/User.js');
const { Post } = require('../models/Post.js'); 
const authenticate = require('../middleware/authenticate.js');
const { readData, writeData, POSTS_PATH } = require('../models/persist');

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
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const userName = user.userName;
    const posts = await readData(POSTS_PATH);

    const newPost = {
        id: posts.length + 1,
        userName: userName,
        content: content,
        userId: userId,
        likes: [],
        time: new Date().toISOString()
    };

    posts.push(newPost);
    await writeData(POSTS_PATH, posts);
    res.json(newPost);
});

router.patch('/api/posts/:postId/like', authenticate, async (req, res) => {
    const postId = parseInt(req.params.postId, 10);
    const userId = req.userId;
    const posts = await readData(POSTS_PATH);
    const post = posts.find(p => p.id === postId);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    if (!post.likes.includes(userId)) {
        post.likes.push(userId);
        await writeData(POSTS_PATH, posts);
    }
    res.json(post);
});

router.patch('/api/posts/:postId/unlike', authenticate, async (req, res) => {
    const postId = parseInt(req.params.postId, 10);
    const userId = req.userId;
    const posts = await readData(POSTS_PATH);
    const post = posts.find(p => p.id === postId);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const index = post.likes.indexOf(userId);
    if (index > -1) {
        post.likes.splice(index, 1);
        await writeData(POSTS_PATH, posts);
    }
    res.json(post);
});

router.get('/api/posts', authenticate, async (req, res) => {
    const currentUserId = req.userId;
    const posts = await readData(POSTS_PATH);

    const enrichedPosts = await Promise.all(posts.map(async post => {
        const user = await User.findById(post.userId);
        if (!user) {
            console.error(`No user found with id: ${post.userId} for post id: ${post.id}`);
            return post;
        }
        return {
            ...post,
            userName: user.userName,
            isLikedByCurrentUser: post.likes.includes(currentUserId),
            likesCount: post.likes.length
        };
    }));

    res.json(enrichedPosts);
});

module.exports = router;
