const jwt = require('jsonwebtoken');
const { User } = require('../models/User.js'); 

async function authenticate(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'YOUR_FALLBACK_SECRET_KEY');
        req.userId = decoded.id;

        // Fetch user from the database to get the userName
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        req.userName = user.userName; 

        next();
    } catch (error) {
        res.status(401).send({ error: 'Invalid token' });
    }
}

module.exports = authenticate;
    